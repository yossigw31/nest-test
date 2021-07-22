import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshTokenStrategy } from './jwt.refresh.strategy';
import { AuthService } from './services/auth.service';
import { WarmupService } from './services/warmup.service';
import { AuthCredentials, AuthCredentialsSchema } from './entity/auth-credentials.entity';
import { JwtStrategy } from './jwt.strategy';
@Module({
  controllers: [AuthController],
  imports: [
    MongooseModule.forFeature([
          {
            name: AuthCredentials.name,
            schema: AuthCredentialsSchema,
          }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({})
  ],
  providers: [
    WarmupService,
    AuthService,
    JwtStrategy,
    JwtRefreshTokenStrategy,
  ],
  exports: [JwtStrategy, PassportModule],

})
export class AuthModule {
 
}
