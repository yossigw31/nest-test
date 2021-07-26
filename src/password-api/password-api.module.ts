import { Module } from '@nestjs/common';
import { PasswordApiController } from './password-api.controller';
import { PasswordApiService } from './service/password-api.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PasswordApi, PasswordApiSchema } from './entity/password-api.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
      AuthModule,
      MongooseModule.forFeature([
      {
        name: PasswordApi.name,
        schema: PasswordApiSchema,
      }]),
  ],
  controllers: [PasswordApiController],
  providers: [PasswordApiService]
})
export class PasswordApiModule {}
