/**
 * @format
 * Create auth dto
 */

import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty()
  mobile_number: string;

  @ApiProperty()
  otp: string;

  @ApiProperty()
  device_details: {
    user_id: string;
    device_unique_id: string;
    device_token_fcm: string;
    device_model: string;
    operating_system: string;
    os_version: string;
    is_login: boolean;
    app_version: string;
    last_login: Date;
    last_logout: Date;
    force_logout: boolean;
  };
}
