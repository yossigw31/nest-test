import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; //Types
import * as mongoose from 'mongoose'; //Types


@Schema({ timestamps: true })
export class PasswordApi extends Document {
  @Prop({ unique: true , required: true}) service: string;
  @Prop({ required: true}) passwords: string[];
}
export const PasswordApiSchema = SchemaFactory.createForClass(PasswordApi);
