import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { JWTService } from 'src/auth/jwt.service';

export const UserMeta = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const logger = new Logger('@UserMeta');
    const req = ctx.switchToHttp().getRequest();

    const jwtService = JWTService.getInstance();

    if (!!req.user) {
      logger.debug('Route protected');
      return !!data ? req.user[data] : req.user;
    }

    // Route not protected, but optional JWT is enabled
    const token = req.headers.authorization
      ? (req.headers.authorization as string).split(' ')
      : null;
    if (token && token[1]) {
      const payload = jwtService.verify(token[1]);
      return jwtService.createMeta(payload);
    }
  },
);
