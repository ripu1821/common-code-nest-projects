/**
 * @format
 * Auth controller
 */

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from 'src/modules/auth/auth.service';
import { CreateAuthDto } from 'src/modules/auth/dto/create-auth.dto';
import userValidationSchema from 'src/modules/users/user.validation';
import { MESSAGES } from 'src/constant/message';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { RefreshTokenGuard } from 'src/guard/refreshToken.guard';
import { AccessTokenGuard } from 'src/guard/accessToken.guard';

@Controller()
@ApiTags('ServiceAuth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   *  User sign up
   * @returns
   */
  @Post('Register')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        mobile_number: { type: 'string' },
        name: { type: 'string' },
      },
      required: ['email', 'mobile_number', 'name'],
    },
  })
  @ApiOperation({
    summary: 'This api use to registers a new user',
    // description: 'Fill tha required field',
  })
  async signup(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const data =
        await userValidationSchema.createUserSchema.validateAsync(
          createUserDto,
        );
      const { user } = await this.authService.signUp(data);
      return res.status(HttpStatus.CREATED).json({
        message: MESSAGES.SIGNUP_SUCCESSFULLY,
        user,
      });
    } catch (error) {
      if (error.isJoi) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: MESSAGES.VALIDATION_ERROR,
          error: error.message,
        });
      }
      if (error.response.message == MESSAGES.MOBILE_NUMBER_ALREADY_EXIST) {
        return res.status(HttpStatus.CONFLICT).json({
          error: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: error.message,
        });
      }
    }
  }

  /**
   *  Verify Otp
   * @returns
   */
  @Post('VerifyOtp')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        mobile_number: { type: 'string' },
        otp: { type: 'string' },
        device_details: {
          type: 'object',
          properties: {
            device_unique_id: { type: 'string' },
            device_token_fcm: { type: 'string' },
            device_model: { type: 'string' },
            operating_system: { type: 'string' },
            os_version: { type: 'string' },
            app_version: { type: 'string' },
          },
        },
      },
      required: ['mobile_number', 'otp'],
    },
  })
  @ApiOperation({
    summary: 'This api use to verify otp',
    // description: 'Fill tha required field',
  })
  async verifyOtp(@Body() crateAuthDto: CreateAuthDto, @Res() res: Response) {
    try {
      const data =
        await userValidationSchema.createLoginSchema.validateAsync(
          crateAuthDto,
        );
      const { user, token } = await this.authService.verifyOtp(data);
      res.status(HttpStatus.OK);
      return res.status(HttpStatus.OK).json({
        message: MESSAGES.OTP_VERIFIED,
        user,
        token,
      });
    } catch (error) {
      if (error.isJoi) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: MESSAGES.VALIDATION_ERROR,
          error: error.message,
        });
      }
      if (error.response.message == MESSAGES.INVALID_OTP) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: error.message,
        });
      }
    }
  }

  /**
   *  Logout
   * @returns
   */
  @UseGuards(AccessTokenGuard)
  @ApiSecurity('JWT-auth')
  @Put('Logout/:device_id')
  @ApiOperation({
    summary: 'This api use to logout user',
    // description: 'Fill tha required field',
  })
  async logoutUser(
    @Res() res: Response,
    @Req() req,
    @Param('device_id') device_unique_id: string,
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      await this.authService.logoutUser(device_unique_id, token);
      return res.status(HttpStatus.OK).json({
        message: MESSAGES.LOGOUT_SUCCESSFULLY,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error.message,
      });
    }
  }

  /**
   *
   * @param req
   * @returns refresh tokens
   */
  @UseGuards(RefreshTokenGuard)
  @ApiSecurity('JWT-auth')
  @Get('/RefreshToken')
  @ApiOperation({
    summary: 'This api use to refresh token',
    // description: 'Fill tha required field',
  })
  async refreshTokens(@Req() req, @Res() res: Response) {
    try {
      const deviceUniqueId = req.user.device;
      const refreshToken = req.user.refreshToken;
      const tokens = await this.authService.refreshTokens(
        deviceUniqueId,
        refreshToken,
      );
      return res.status(HttpStatus.OK).json(tokens);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error.message,
      });
    }
  }
}
