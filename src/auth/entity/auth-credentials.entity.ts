import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; //Types
import * as mongoose from 'mongoose'; //Types


@Schema({ timestamps: true })
export class AuthCredentials extends Document {
  @Prop() username: string;
  @Prop() password: string;
  @Prop() refreshToken: string;
}
export const AuthCredentialsSchema = SchemaFactory.createForClass(AuthCredentials);
