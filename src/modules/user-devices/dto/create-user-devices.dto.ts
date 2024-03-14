/**
 *  @format
 * Create User Device dto
 */

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDeviceDto {
  @ApiProperty()
  user_id: string;

  @ApiProperty()
  device_unique_id: string;

  @ApiProperty()
  device_token_fcm: string;

  @ApiProperty()
  device_model: string;

  @ApiProperty()
  operating_system: string;

  @ApiProperty()
  os_version: string;

  @ApiProperty()
  is_login: boolean;

  @ApiProperty()
  app_version: string;

  @ApiProperty()
  last_login: Date;

  @ApiProperty()
  last_logout: Date;

  @ApiProperty()
  force_logout: boolean;

  refreshToken: string;
}
