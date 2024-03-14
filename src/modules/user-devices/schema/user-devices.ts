/**
 *  @format
 * User Device schema
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { User } from 'src/modules/users/schema/users';

export type UserDeviceDocument = UserDevice & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class UserDevice extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: User | string;

  @Prop({ required: true, unique: true })
  device_unique_id: string;

  @Prop()
  device_token_fcm: string;

  @Prop()
  device_model: string;

  @Prop()
  operating_system: string;

  @Prop()
  os_version: string;

  @Prop()
  is_login: boolean;

  @Prop()
  app_version: string;

  @Prop()
  last_login: Date;

  @Prop()
  last_logout: Date;

  @Prop()
  force_logout: boolean;

  @Prop()
  refreshToken: string;
}

export const UserDeviceSchema = SchemaFactory.createForClass(UserDevice);
