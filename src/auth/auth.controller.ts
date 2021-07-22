import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Res,
    UseGuards,
    UsePipes,
    Headers,
    HttpCode
} from '@nestjs/common';

import { Request } from 'express';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserGuard } from './guard/user.guard';
import { UserTokens } from './interfaces/jwt-payload.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {AuthCredentials} from './entity/auth-credentials.entity';
import JwtRefreshGuard from './jwt.refresh.guard';
import { GetUser } from './decorators/get-user.decorator';
import { AuthService } from './services/auth.service';
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Post('/login')
    @UseGuards(UserGuard)
    @HttpCode(200)
    async signin(
        @Body() dto: AuthCredentialsDto,
        @Res() res: Response,
    ): Promise<any> {
        console.log('controller signin');
        // console.log({ dto });
        return await this.generateTokens(dto, res);
    }

    private async generateTokens(dto, res) {
        const {
            accessTokenCookie,
            refreshTokenCookie,
        } = await this.authService.signin(dto);


        res.setHeader('Set-Cookie', [
            accessTokenCookie.cookie,
            refreshTokenCookie.cookie,
        ]);
        console.log('response header was set');

        return res.json({"access_token": accessTokenCookie.token, "refresh_token": refreshTokenCookie.token});
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: AuthCredentials): AuthCredentials {
        console.log(user);
        return user;
    }

    @UseGuards(JwtRefreshGuard)
    @Post('/refresh')
    async refresh(@GetUser() user: AuthCredentials, @Res() res: Response) {


        console.log('refresh, user.id:', user.id);
        const {
            accessTokenCookie,
            refreshTokenCookie,
        } = await this.authService.setNewRefreshTokenAndAccessToken(user);


        res.setHeader('Set-Cookie', [
            accessTokenCookie.cookie,
            refreshTokenCookie.cookie,
        ]);
        console.log('response header was set');
        return res.json({"access_token": accessTokenCookie.token, "refresh_token": refreshTokenCookie.token});
    }

}
