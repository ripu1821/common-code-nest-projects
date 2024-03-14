/**
 * @format
 * Update approve filed dto
 */

import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { CreateUserDto } from './create-user.dto';
export class UpdateFieldDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  approve: boolean;
}
