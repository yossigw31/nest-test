import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
const { NODE_ENV } = process.env;
import * as config from 'config';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
const db = config.get('db');
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { PasswordApiModule } from './password-api/password-api.module';

const mongooseOptions: MongooseModuleOptions = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
};

@Module({
  imports: [    
      ConfigModule.forRoot({
    envFilePath: path.resolve(process.cwd(), 'env', `.env.${NODE_ENV}`),
  }),
      MongooseModule.forRoot(process.env.MONGO_URI || db.uri, mongooseOptions),
      AuthModule,
      PasswordApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
