import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type AuthUserPayload = {
  userId: string;
  email: string;
};

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthUserPayload | undefined;
    if (!user) {
      return undefined;
    }
    return data ? user[data] : user;
  },
);
