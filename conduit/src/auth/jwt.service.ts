import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { JwtPayload } from './interface/jwtPayload.interface';

@Injectable()
export class JWTService {
  constructor(private readonly nestJwtService: NestJwtService) {}

  async createToken(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      iss: 'conduitAuthService',
    };

    return this.nestJwtService.sign(payload);
  }
}
