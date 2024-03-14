/**
 * @format
 * User schema
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User extends Document {
  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true, required: true })
  mobile_number: string;

  @Prop()
  name: string;

  @Prop({ default: false })
  is_delete: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
