/**
 * @format
 * Create user dto
 */

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  mobile_number: string;

  @ApiProperty()
  name: string;
}
