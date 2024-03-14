/**
 * @format
 * User Device service
 */

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  UserDevice,
  UserDeviceDocument,
} from 'src/modules/user-devices/schema/user-devices';
import { CreateUserDeviceDto } from 'src/modules/user-devices/dto/create-user-devices.dto';
import { UpdateUserDeviceDto } from 'src/modules/user-devices/dto/update-user-devices.dto';
import { MESSAGES } from 'src/constant/message';
import { removeNullParams } from 'src/helper/utils';

@Injectable()
export class UserDeviceService {
  constructor(
    @InjectModel(UserDevice.name)
    private UserDeviceModel: Model<UserDeviceDocument>,
  ) {}

  /**
   * Create user device
   * @returns
   */
  async createUserDevice(createUserDeviceDto: CreateUserDeviceDto) {
    const existingUserDevice = await this.UserDeviceModel.findOne({
      device_unique_id: createUserDeviceDto.device_unique_id,
    }).exec();

    if (existingUserDevice) {
      existingUserDevice.set(createUserDeviceDto);
      return existingUserDevice.save();
    }
    const createdUserDevice = new this.UserDeviceModel(createUserDeviceDto);
    return createdUserDevice.save();
  }

  /**
   * Get all user devices
   * @returns
   */
  getAllUserDevices(): Promise<UserDeviceDocument[]> {
    return this.UserDeviceModel.find().populate('user_id').exec();
  }

  /**
   * Get user device by id
   * @returns
   */
  async getUserDeviceById(id: string): Promise<UserDeviceDocument> {
    try {
      const userDevice = await this.UserDeviceModel.findById(id)
        .populate('user_id')
        .exec();

      if (!userDevice) {
        throw new BadRequestException(MESSAGES.USER_DEVICE_NOT_FOUND);
      }

      return userDevice;
    } catch (error) {
      if (error) {
        throw new BadRequestException(MESSAGES.USER_DEVICE_NOT_FOUND);
      }
      throw error;
    }
  }

  /**
   * Update user device by id
   * @returns
   */
  async updateUserDevice(
    id: string,
    updateUserDeviceDto: UpdateUserDeviceDto,
  ): Promise<UserDeviceDocument> {
    try {
      const existingUserDevice = await this.UserDeviceModel.findById(id).exec();
      const userDeviceData = removeNullParams(updateUserDeviceDto);
      if (!existingUserDevice) {
        throw new BadRequestException(MESSAGES.USER_DEVICE_NOT_FOUND);
      }

      const updatedUserDevice = await this.UserDeviceModel.findByIdAndUpdate(
        id,
        userDeviceData,
        { new: true },
      ).exec();

      return updatedUserDevice;
    } catch (error) {
      if (error) {
        throw new BadRequestException(MESSAGES.USER_DEVICE_NOT_FOUND);
      }
      throw error;
    }
  }

  /**
   * Delete user device
   * @returns
   */
  async deleteUserDevice(id: string): Promise<UserDeviceDocument> {
    try {
      const existingUserDevice = await this.UserDeviceModel.findById(id).exec();
      if (!existingUserDevice) {
        throw new BadRequestException(MESSAGES.USER_DEVICE_NOT_FOUND);
      }

      const removedUserDevice =
        await this.UserDeviceModel.findByIdAndDelete(id).exec();

      return removedUserDevice;
    } catch (error) {
      if (error) {
        throw new BadRequestException(MESSAGES.USER_DEVICE_NOT_FOUND);
      }
      throw error;
    }
  }

  /**
   *  update logout time to current time
   * @returns
   */
  async updateLogoutTimeByUniqueId(
    device_unique_id: string,
  ): Promise<UserDeviceDocument> {
    try {
      const userDevice = await this.UserDeviceModel.findOne({
        device_unique_id,
      }).exec();

      if (!userDevice) {
        throw new BadRequestException(MESSAGES.USER_DEVICE_NOT_FOUND);
      }

      userDevice.last_logout = new Date();
      const updatedUserDevice = await userDevice.save();

      return updatedUserDevice;
    } catch (error) {
      if (error) {
        throw new BadRequestException(MESSAGES.USER_DEVICE_NOT_FOUND);
      }
      throw error;
    }
  }

  /**
   * Find user device by device_unique_id
   */
  async findUserDeviceByUniqueId(
    device_unique_id: string,
  ): Promise<UserDeviceDocument> {
    const userDevice = await this.UserDeviceModel.findOne({
      device_unique_id,
    }).exec();

    if (!userDevice) {
      throw new BadRequestException(MESSAGES.USER_DEVICE_NOT_FOUND);
    }

    return userDevice;
  }

  /**
   * update refresh refresh
   * @returns
   */
  async updateRefreshToken(id: string, refreshToken: string) {
    try {
      const device = await this.UserDeviceModel.findById(id).exec();
      if (!device) {
        throw new BadRequestException(MESSAGES.USER_DEVICE_NOT_FOUND);
      }
      device.refreshToken = refreshToken;
      return await device.save();
    } catch (error) {
      throw new BadRequestException(MESSAGES.USER_DEVICE_NOT_FOUND);
    }
  }
}
