import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
// import { jwtConstants } from './constants';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as config from 'config';
import { AuthCredentials } from './entity/auth-credentials.entity';
import { AuthService } from './services/auth.service';

const jwt = config.get('jwt');

const { REFRESH_TOKEN_SECRET } = process.env;

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: REFRESH_TOKEN_SECRET || jwt.refresh_token_secret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload): Promise<AuthCredentials> {
    const refreshToken = request.headers?.authorization;
    const user = await this.authService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.id,
    );
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
