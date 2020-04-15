import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { User } from 'src/user/dto/user.dto';
import { AuthMeta } from './interface/authMeta.interface';
import { JwtPayload } from './interface/jwtPayload.interface';

@Injectable()
export class JWTService {
  private static jwtService: JWTService;
  constructor(private readonly nestJwtService: NestJwtService) {
    JWTService.jwtService = this;
  }

  createToken(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      iss: 'conduitAuthService',
    };

    return this.nestJwtService.sign(payload);
  }

  decode(token: string) {
    return this.nestJwtService.decode(token);
  }

  verify(token: string) {
    return this.nestJwtService.verify(token);
  }

  createMeta(payload: JwtPayload): AuthMeta {
    return {
      userId: payload.sub,
      username: payload.username,
      email: payload.email,
    };
  }

  static getInstance(): JWTService {
    return this.jwtService;
  }
}
