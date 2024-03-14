/**
 * @format
 * User Device module
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  UserDevice,
  UserDeviceSchema,
} from 'src/modules/user-devices/schema/user-devices';
import { UserDeviceService } from 'src/modules/user-devices/user-devices.service';
import { UserDeviceController } from 'src/modules/user-devices/user-devices.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDevice.name, schema: UserDeviceSchema },
    ]),
  ],
  controllers: [UserDeviceController],
  providers: [UserDeviceService],
  exports: [UserDeviceService],
})
export class UserDeviceModule {}
