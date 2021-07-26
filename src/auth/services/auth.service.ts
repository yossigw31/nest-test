import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import * as bcrypt from 'bcryptjs';
import * as ms from 'ms';
import { JwtService } from '@nestjs/jwt';
import {
  JwtPayload,
  TokenCookie,
  UserTokens,
} from '../interfaces/jwt-payload.interface';
import * as config from 'config';
import { AuthCredentials } from '../entity/auth-credentials.entity';
//load code config values from current env
const jwt = config.get('jwt');
const {
  access_token_secret,
  access_token_expiration_time,
  refresh_token_secret,
  refresh_token_expiration_time,
} = jwt;
//If environment vars are not defined - use the code config values as defaults
const {
  ACCESS_TOKEN_SECRET = access_token_secret,
  ACCESS_TOKEN_EXPIRATION_TIME = access_token_expiration_time,
  REFRESH_TOKEN_SECRET = refresh_token_secret,
  REFRESH_TOKEN_EXPIRATION_TIME = refresh_token_expiration_time,
} = process.env;

@Injectable()
export class AuthService {
  constructor(
      @InjectModel(AuthCredentials.name) private readonly authCredentialModel: Model<AuthCredentials>,
      private readonly jwtService: JwtService,
  ) {}

  async signup(dto: AuthCredentialsDto): Promise<string> {
    const { username, password } = dto;

    const user = await this.authCredentialModel.findOne({ username });
    if (user) {
      // user already exists
        return;
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log({ salt, hashedPassword });

    const newUser = await this.authCredentialModel.create({
      username,
      password: hashedPassword,
    });
    return newUser.id;
  }
  //--------
  async createAccessTokenCookie(userId: string): Promise<TokenCookie> {

    // const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRATION_TIME } = jwtConstants;
    const payload: JwtPayload = { id: userId };
    const accessToken = await this.jwtService.sign(payload, {
      secret: ACCESS_TOKEN_SECRET,
      expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
    });
    //Max-Age is in seconds...
    const accessExpirationInSeconds = ms(ACCESS_TOKEN_EXPIRATION_TIME) * 1000;
    const accessTokenCookie = `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${accessExpirationInSeconds} SameSite=Strict`;

    return {
      cookie: accessTokenCookie,
      token: accessToken,
    };
  }
  async createRefreshTokenCookie(userId: string): Promise<TokenCookie> {
    console.log('createRefreshTokenCookie');
    // const {
    //   REFRESH_TOKEN_SECRET,
    //   REFRESH_TOKEN_EXPIRATION_TIME,
    // } = jwtConstants;
    const payload: JwtPayload = { id: userId };
    const refreshToken = await this.jwtService.sign(payload, {
      secret: REFRESH_TOKEN_SECRET,
      expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
    });
    //Max-Age is in seconds...
    const refreshExpirationInSeconds = ms(REFRESH_TOKEN_EXPIRATION_TIME) * 1000;
    const refreshTokenCookie = `Refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${refreshExpirationInSeconds} SameSite=Strict`;

    return {
      cookie: refreshTokenCookie,
      token: refreshToken,
    };
  }
  async setUserRefreshToken(
      refreshToken: string,
      userId: string,
  ): Promise<AuthCredentials> {
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt,);

    const user = await this.authCredentialModel.findByIdAndUpdate(
        userId,
        { refreshToken: hashedRefreshToken },
        { new: true },
    );
    return user;
  }

  async getUserIfRefreshTokenMatches(
      refreshToken: string,
      userId: string,
  ): Promise<AuthCredentials | false> {
    const user = await this.authCredentialModel.findById(userId);
    if (!user) return false;
    refreshToken = refreshToken.replace('Bearer ','');
    const isMatching = await bcrypt.compare(refreshToken, user.refreshToken);
    return isMatching ? user : false;
  }
  async removeUserRefreshToken(userId: string): Promise<void> {
    await this.authCredentialModel.findByIdAndUpdate(userId, { refreshToken: null });
  }
  getSignOutCookies(): string[] {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0 SameSite=Strict',
      'Refresh=; HttpOnly; Path=/; Max-Age=0 SameSite=Strict',
    ];
  }
  //--------
  async signin(dto: AuthCredentialsDto): Promise<UserTokens> {
    const { username, password } = dto;
    let user = await this.authCredentialModel.findOne({ username });
    //if no user found...
    if (!user) {
      throw new UnauthorizedException('Wrong credentials...');
    }
    // check if the password is valid
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException('Wrong credentials...');
    }
    console.log('service signin');
    const accessTokenCookie = await this.createAccessTokenCookie(user.id);
    const refreshTokenCookie = await this.createRefreshTokenCookie(user.id);

    user = await this.setUserRefreshToken(refreshTokenCookie.token, user.id);

    return {  accessTokenCookie, refreshTokenCookie };
  }

  async setNewRefreshTokenAndAccessToken(user: AuthCredentials): Promise<UserTokens>{
    const accessTokenCookie = await this.createAccessTokenCookie(user.id);
    const refreshTokenCookie = await this.createRefreshTokenCookie(user.id);

    user = await this.setUserRefreshToken(refreshTokenCookie.token, user.id);

    return {  accessTokenCookie, refreshTokenCookie };
  }
}
