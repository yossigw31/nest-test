import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: any = context.switchToHttp().getRequest();
    try {
      const password: string = request?.body?.password;
      const username: string = request?.body?.username;

      if (!password || !username) {
        throw new Error();
      }

      if(password!=='123456' || username !=='admin'){
        throw new UnauthorizedException();
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
