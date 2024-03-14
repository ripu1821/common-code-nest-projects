/**
 * @format
 * Auth service
 */

import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PhoneNumberUtil, PhoneNumber } from 'google-libphonenumber';

import { CreateAuthDto } from 'src/modules/auth/dto/create-auth.dto';
import { UsersService } from 'src/modules/users/users.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { MESSAGES } from 'src/constant/message';
import { RedisService } from 'src/modules/redis';
import { UserDeviceService } from 'src/modules/user-devices';
import { decryptData, encryptData } from 'src/helper/utils';

@Injectable()
export class AuthService {
  private phoneNumberUtil: PhoneNumberUtil;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly userDeviceService: UserDeviceService,
  ) {
    this.phoneNumberUtil = PhoneNumberUtil.getInstance();
  }
  encryptionKey = process.env.ENCRYPT_KEY;

  /**
   * User sign up
   * @returns
   */
  async signUp(createUserDto: CreateUserDto): Promise<any> {
    try {
      const { mobile_number } = createUserDto;

      // Parse and validate phone number
      const parsedPhoneNumber: PhoneNumber =
        this.phoneNumberUtil.parseAndKeepRawInput(mobile_number, 'IN');

      if (!this.phoneNumberUtil.isValidNumber(parsedPhoneNumber)) {
        throw new BadRequestException(MESSAGES.INVALID_PHONE);
      }

      // Check if user with the same phone number already exists
      const existingUser =
        await this.usersService.findUserByMobileNumber(mobile_number);
      if (existingUser) {
        throw new BadRequestException(MESSAGES.MOBILE_NUMBER_ALREADY_EXIST);
      } else {
        // Create new user
        const user = await this.usersService.createUser(createUserDto);

        return { user };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verifies the OTP sent to the provided phone number.
   * @param createAuthDto
   * @returns
   */
  async verifyOtp(createAuthDto: CreateAuthDto): Promise<any> {
    try {
      const { mobile_number, otp, device_details } = createAuthDto;

      // Parse and validate phone number
      const parsedPhoneNumber: PhoneNumber =
        this.phoneNumberUtil.parseAndKeepRawInput(mobile_number, 'IN');

      if (!this.phoneNumberUtil.isValidNumber(parsedPhoneNumber)) {
        throw new BadRequestException(MESSAGES.INVALID_PHONE);
      }

      // Find user by phone number
      const user =
        await this.usersService.findUserByMobileNumber(mobile_number);
      if (!user) {
        throw new BadRequestException(MESSAGES.USER_NOT_FOUND);
      }
      // Verify OTP
      if (otp !== '1234') {
        throw new BadRequestException(MESSAGES.INVALID_OTP);
      }
      // Generate tokens
      const token = await this.getTokens(
        user._id,
        createAuthDto.device_details.device_unique_id,
      );

      // Save user device details
      const lastLogin = (createAuthDto.device_details.last_login = new Date());
      const refreshToken = encryptData(token.refreshToken, this.encryptionKey);
      await this.userDeviceService.createUserDevice({
        ...device_details,
        user_id: user._id,
        last_login: lastLogin,
        refreshToken,
      });

      // Return user, token, and verification status
      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  /**
   * User Logout
   * @returns
   */
  async logoutUser(device_unique_id: string, token: string): Promise<any> {
    try {
      const response =
        await this.userDeviceService.updateLogoutTimeByUniqueId(
          device_unique_id,
        );
      if (response) {
        await this.redisService.addToBlacklist(token);
        return response;
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param userId
   * @param refreshToken
   * @returns refresh tokens
   */
  async refreshTokens(deviceUniqueId: string, refreshToken: string) {
    const device =
      await this.userDeviceService.findUserDeviceByUniqueId(deviceUniqueId);
    if (!device || !device.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }
    const data = decryptData(device.refreshToken, this.encryptionKey);
    if (data === refreshToken) {
      const tokens = await this.getTokens(
        device.user_id.toString(),
        deviceUniqueId,
      );
      const refreshToken = encryptData(tokens.refreshToken, this.encryptionKey);
      await this.userDeviceService.updateRefreshToken(device._id, refreshToken);
      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    }
    throw new ForbiddenException('Access Denied');
  }

  /**
   * Create access tokens
   * @param userId
   * @param email
   * @returns
   */
  async getTokens(userId: string, device: string) {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          {
            _id: userId,
            device,
          },
          {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: process.env.JWT_TOKEN_EXPIRING_TIME,
          },
        ),
        this.jwtService.signAsync(
          {
            _id: userId,
            device,
          },
          {
            secret: process.env.JWT_REFRESH_SECRET,
          },
        ),
      ]);

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }
}
