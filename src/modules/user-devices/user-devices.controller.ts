/**
 * @format
 * User Device controller
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { UserDeviceService } from 'src/modules/user-devices/user-devices.service';
import { CreateUserDeviceDto } from 'src/modules/user-devices/dto/create-user-devices.dto';
import { UpdateUserDeviceDto } from 'src/modules/user-devices/dto/update-user-devices.dto';
import { MESSAGES } from 'src/constant/message';
import userDeviceValidationSchema from 'src/modules/user-devices/user-devices.validation';
import { AccessTokenGuard } from 'src/guard/accessToken.guard';

@UseGuards(AccessTokenGuard)
@ApiSecurity('JWT-auth')
@Controller()
@ApiTags('UserDevice')
export class UserDeviceController {
  constructor(private readonly userDeviceService: UserDeviceService) {}

  /**
   * Create user device
   * @returns
   */
  @ApiExcludeEndpoint()
  @Post('CreateUserDevice')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user_id: { type: 'string' },
        device_unique_id: { type: 'string' },
        device_token_fcm: { type: 'string' },
        device_model: { type: 'string' },
        operating_system: { type: 'string' },
        os_version: { type: 'string' },
        is_login: { type: 'boolean' },
        app_version: { type: 'string' },
        last_login: { type: 'Date' },
        last_logout: { type: 'Date' },
        created_ts: { type: 'Date' },
        force_logout: { type: 'boolean' },
      },
    },
  })
  @ApiOperation({
    summary: 'This api use to create a new device',
    // description: 'Fill tha required field',
  })
  async createUserDevice(
    @Body() createUserDeviceDto: CreateUserDeviceDto,
    @Res() res: Response,
  ) {
    try {
      // Validate using Joi schema
      const data =
        await userDeviceValidationSchema.createUserDeviceSchema.validateAsync(
          createUserDeviceDto,
        );

      const userDeviceDetail =
        await this.userDeviceService.createUserDevice(data);
      return res.status(HttpStatus.CREATED).json({
        message: MESSAGES.USER_DEVICE_CREATED,
        data: userDeviceDetail,
      });
    } catch (error) {
      if (error.isJoi) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: MESSAGES.VALIDATION_ERROR,
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
   * Get all user devices
   * @returns
   */
  @ApiExcludeEndpoint()
  @Get('/GetAllUserDevices')
  @ApiOperation({
    summary: 'This api use to get all device',
    // description: 'Fill tha required field',
  })
  async getAllUserDevices(@Res() res: Response) {
    try {
      const userDeviceDetail = await this.userDeviceService.getAllUserDevices();
      return res.status(HttpStatus.OK).json({
        data: userDeviceDetail,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error.message,
      });
    }
  }

  /**
   * Get user device by id
   * @returns
   */
  @ApiExcludeEndpoint()
  @Get('/GetUserDeviceById/:id')
  @ApiOperation({
    summary: 'This api use to get device by id',
    // description: 'Fill tha required field',
  })
  async getUserDeviceById(@Param('id') id: string, @Res() res: Response) {
    try {
      // Validate using Joi schema
      const data =
        await userDeviceValidationSchema.getUserDeviceById.validateAsync(id);
      const userDeviceDetail =
        await this.userDeviceService.getUserDeviceById(data);
      return res.status(HttpStatus.OK).json({
        data: userDeviceDetail,
      });
    } catch (error) {
      if (error.isJoi) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: MESSAGES.VALIDATION_ERROR,
          error: error.message,
        });
      }
      if (error.response.message == MESSAGES.USER_DEVICE_NOT_FOUND) {
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
   * Update user device by id
   * @returns
   */
  @ApiExcludeEndpoint()
  @Put('/UpdateUserDeviceById/:id')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user_id: { type: 'string' },
        device_unique_id: { type: 'string' },
        device_token_fcm: { type: 'string' },
        device_model: { type: 'string' },
        operating_system: { type: 'string' },
        os_version: { type: 'string' },
        is_login: { type: 'boolean' },
        app_version: { type: 'string' },
        last_login: { type: 'Date' },
        last_logout: { type: 'Date' },
        created_ts: { type: 'Date' },
        force_logout: { type: 'boolean' },
      },
    },
  })
  @ApiOperation({
    summary: 'This api use to update device by id',
    // description: 'Fill tha required field',
  })
  async updateUserDevice(
    @Param('id') id: string,
    @Body() updateUserDeviceDto: UpdateUserDeviceDto,
    @Res() res: Response,
  ) {
    try {
      // Validate using Joi schema
      const data =
        await userDeviceValidationSchema.updateUserDeviceSchema.validateAsync({
          id,
          ...updateUserDeviceDto,
        });

      const userDeviceDetail = await this.userDeviceService.updateUserDevice(
        id,
        data,
      );
      return res.status(HttpStatus.OK).json({
        message: MESSAGES.USER_DEVICE_UPDATED,
        data: userDeviceDetail,
      });
    } catch (error) {
      if (error.isJoi) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: MESSAGES.VALIDATION_ERROR,
          error: error.message,
        });
      }
      if (error.response.message == MESSAGES.USER_DEVICE_NOT_FOUND) {
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
   * Delete user device
   * @returns
   */
  @ApiExcludeEndpoint()
  @Delete('/DeleteUserDeviceById/:id')
  @ApiOperation({
    summary: 'This api use to delete device by id',
    // description: 'Fill tha required field',
  })
  async deleteUserDevice(@Param('id') id: string, @Res() res: Response) {
    try {
      // Validate using Joi schema
      const data =
        await userDeviceValidationSchema.deleteUserDeviceSchema.validateAsync(
          id,
        );
      await this.userDeviceService.deleteUserDevice(data);
      return res.status(HttpStatus.OK).json({
        message: MESSAGES.USER_DEVICE_DELETED,
      });
    } catch (error) {
      if (error.isJoi) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: MESSAGES.VALIDATION_ERROR,
          error: error.message,
        });
      }
      if (error.response.message == MESSAGES.USER_DEVICE_NOT_FOUND) {
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
}
