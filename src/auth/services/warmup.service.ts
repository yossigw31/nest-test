import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Injectable()
export class WarmupService implements OnApplicationBootstrap {
    constructor(private readonly authService: AuthService){}

    onApplicationBootstrap() {
        
        const dto:AuthCredentialsDto = {
            password:'123456',
            username:'admin'
        }
        return this.authService.signup(dto);
    }
}
