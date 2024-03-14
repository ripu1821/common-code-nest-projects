/**
 * @format
 * User controller
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiSecurity,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Response } from 'express';

import { UsersService } from 'src/modules/users/users.service';
import { UpdateUserDto } from 'src/modules/users/dto/update-user.dto';
import { AccessTokenGuard } from 'src/guard/accessToken.guard';
import { MESSAGES } from 'src/constant/message';
import userValidationSchema from 'src/modules/users/user.validation';

@UseGuards(AccessTokenGuard)
@ApiSecurity('JWT-auth')
@Controller()
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get user profile by the current login token
   * @returns
   */
  @Get('/Profile')
  @ApiOperation({
    summary: 'This api use to get profile',
  })
  async getProfile(@Req() req: any, @Res() res: Response) {
    try {
      const loginUserId = req.user._id;
      const users = await this.usersService.getLoginUser(loginUserId);
      return res.status(HttpStatus.OK).send({ data: users });
    } catch (error) {
      if (error.response.message == MESSAGES.LOGIN_USER_DELETED) {
        return res.status(HttpStatus.NO_CONTENT).json({
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
   *  user profile update
   * @returns
   */
  @Put('UpdateUserProfile')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        mobile_number: { type: 'string' },
        name: { type: 'string' },
      },
    },
  })
  @ApiOperation({
    summary: 'This api use to update profile',
  })
  async updateUserProfile(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const loginUserId = req.user._id;

      // Validate using Joi schema
      const data =
        await userValidationSchema.updateUserProfileSchema.validateAsync(
          updateUserDto,
        );
      const user = await this.usersService.updateUserProfile(loginUserId, data);
      return res.status(HttpStatus.OK).json({
        message: MESSAGES.USER_UPDATED,
        user,
      });
    } catch (error) {
      if (error.isJoi) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: MESSAGES.VALIDATION_ERROR,
          error: error.message,
        });
      }
      if (error.response.message == MESSAGES.USER_NOT_FOUND) {
        return res.status(HttpStatus.NOT_FOUND).json({
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
   * Get all users list
   * @returns
   */
  @Get('/GetAllUsers')
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by name name',
  })
  @ApiOperation({
    summary: 'This api use to get all users',
  })
  async getAllUsers(@Query() query: ExpressQuery, @Res() res: Response) {
    try {
      // Validate using Joi schema
      const data =
        await userValidationSchema.getAllUserSchema.validateAsync(query);
      const users = await this.usersService.getAllUsers(data);
      return res.status(HttpStatus.OK).json({
        data: users,
      });
    } catch (error) {
      if (error.isJoi) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: MESSAGES.VALIDATION_ERROR,
          error: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error.message,
      });
    }
  }

  /**
   * User find by id
   * @returns
   */
  @Get('/GetUserById/:id')
  @ApiOperation({
    summary: 'This api use to get user by id',
  })
  async getUserById(@Param('id') id: string, @Res() res: Response) {
    try {
      // Validate using Joi schema
      const data =
        await userValidationSchema.getUserByIdSchema.validateAsync(id);
      const user = await this.usersService.getUserById(data);
      return res.status(HttpStatus.OK).json({
        data: user,
      });
    } catch (error) {
      if (error.isJoi) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: MESSAGES.VALIDATION_ERROR,
          error: error.message,
        });
      }
      if (error.response.message == MESSAGES.USER_NOT_FOUND) {
        return res.status(HttpStatus.NOT_FOUND).json({
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
   *  User update by id
   * @returns
   */
  @Put('UpdateUserById/:id')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        mobile_number: { type: 'string' },
        name: { type: 'string' },
      },
    },
  })
  @ApiOperation({
    summary: 'This api use to update user by id',
  })
  async updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      // Validate using Joi schema
      const data = await userValidationSchema.updateUserSchema.validateAsync({
        id,
        ...updateUserDto,
      });
      const user = await this.usersService.updateUserById(id, data);
      return res.status(HttpStatus.OK).json({
        message: MESSAGES.USER_UPDATED,
        user,
      });
    } catch (error) {
      if (error.isJoi) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: MESSAGES.VALIDATION_ERROR,
          error: error.message,
        });
      }
      if (error.response.message == MESSAGES.USER_NOT_FOUND) {
        return res.status(HttpStatus.NOT_FOUND).json({
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
   * User delete by id
   * @param id
   * @returns
   */
  @Delete('/DeleteUserById/:id')
  @ApiOperation({
    summary: 'This api use to delete user by id',
  })
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    try {
      // Validate using Joi schema
      const data =
        await userValidationSchema.deleteUserSchema.validateAsync(id);
      await this.usersService.deleteUser(data);
      return res.status(HttpStatus.CREATED).json({
        message: MESSAGES.USER_DELETED,
      });
    } catch (error) {
      if (error.isJoi) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: MESSAGES.VALIDATION_ERROR,
          error: error.message,
        });
      }
      if (error.response.message == MESSAGES.USER_NOT_FOUND) {
        return res.status(HttpStatus.NOT_FOUND).json({
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
