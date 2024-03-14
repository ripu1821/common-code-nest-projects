/**
 * @format
 * Update user dto
 */

import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  email: string;

  @ApiProperty()
  mobile_number: string;

  @ApiProperty()
  name: string;
}
