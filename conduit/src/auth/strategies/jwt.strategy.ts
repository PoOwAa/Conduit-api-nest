import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from '../../config/app/appConfig.service';
import { AuthMeta } from '../interface/authMeta.interface';
import { JwtPayload } from '../interface/jwtPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger: Logger = new Logger(JwtStrategy.name);

  constructor(appConfig: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Token'),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwtSecret,
      issuer: 'conduitAuthService',
    });
  }

  async validate(payload: JwtPayload): Promise<AuthMeta> {
    return {
      userId: payload.sub,
      username: payload.username,
      email: payload.email,
    };
  }
}
