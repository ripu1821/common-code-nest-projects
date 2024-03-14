/**
 * @format
 * User service
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Query } from 'express-serve-static-core';

import { User, UserDocument } from 'src/modules/users/schema/users';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/users/dto/update-user.dto';
import { MESSAGES } from 'src/constant/message';
import { removeNullParams } from 'src/helper/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  /**
   *  Create user
   * @returns
   */
  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    const data = removeNullParams(createUserDto);

    const createdUser = new this.userModel(data);
    const userResponse = await createdUser.save();
    return userResponse;
  }

  /**
   *  Get all users
   * @returns
   */
  async getAllUsers(query: Query) {
    const search = query.search
      ? {
          name: {
            $regex: query.search,
            $options: 'i',
          },
        }
      : {};
    const users = await this.userModel.find(search).exec();

    return users;
  }

  /**
   * User find by email
   * @returns
   */
  async findUserByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  /**
   * User find by phone number
   * @returns
   */
  async findUserByMobileNumber(mobile_number: string): Promise<UserDocument> {
    return this.userModel.findOne({ mobile_number });
  }

  /**
   * User find by id
   * @returns
   */
  async getUserById(id: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new BadRequestException(MESSAGES.USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error) {
        throw new BadRequestException(error);
      }
      throw error;
    }
  }

  /**
   * User delete
   * @returns
   */
  async deleteUser(id: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new BadRequestException(MESSAGES.USER_NOT_FOUND);
      }
      return await this.userModel.findByIdAndDelete(id).exec();
    } catch (error) {
      if (error) {
        throw new BadRequestException(MESSAGES.USER_NOT_FOUND);
      }
      throw error;
    }
  }

  /**
   * User update by id
   * @returns
   */
  async updateUserById(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    try {
      const existingUser = await this.userModel.findById(id).exec();
      const data = removeNullParams(updateUserDto);
      if (!existingUser) {
        throw new BadRequestException(MESSAGES.USER_NOT_FOUND);
      } else {
        const updatedUser = await this.userModel.findByIdAndUpdate(id, data, {
          new: true,
        });
        return updatedUser;
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get user data after login
   * @returns
   */
  async getLoginUser(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new BadRequestException(MESSAGES.LOGIN_USER_DELETED);
    }

    if (user?.is_delete) {
      throw new BadRequestException(MESSAGES.LOGIN_USER_DELETED);
    }
    return user;
  }

  /**
   * Login user update
   * @returns
   */
  async updateUserProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    try {
      const existingUser = await this.userModel.findById(userId).exec();
      const data = removeNullParams(updateUserDto);
      if (!existingUser) {
        throw new BadRequestException(MESSAGES.USER_NOT_FOUND);
      } else {
        const updatedUser = await this.userModel.findByIdAndUpdate(
          userId,
          data,
          {
            new: true,
          },
        );
        return updatedUser;
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
