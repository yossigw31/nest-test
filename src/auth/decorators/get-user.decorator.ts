import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthCredentials } from '../entity/auth-credentials.entity';

export const GetUser = createParamDecorator(
  (data: any, ctx: ExecutionContext): AuthCredentials => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
