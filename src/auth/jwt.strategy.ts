import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtConstants } from './constants';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthCredentials } from './entity/auth-credentials.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(AuthCredentials.name) private readonly usersModel: Model<AuthCredentials>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthCredentials> {
    const user = await this.usersModel.findById(payload.id);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
