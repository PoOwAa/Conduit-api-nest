import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { LoginResponseDto } from '../user/dto/login-response.dto';
import { LoginDto } from '../user/dto/login.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { JWTService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JWTService,
  ) {}

  async validateUser(credentials: LoginDto): Promise<any> {
    const user = await this.userService.findOne({
      where: {
        email: credentials.email,
      },
    });

    if (user) {
      if (await argon2.verify(user.password, credentials.password)) {
        const { password, ...result } = user;
        return result;
      }
    }

    return null;
  }

  async login(user: User): Promise<LoginResponseDto> {
    const token = await this.jwtService.createToken(user);

    const res: LoginResponseDto = {
      email: user.email,
      token,
      username: user.username,
      bio: user.bio,
      image: user.image,
    };

    return res;
  }
}
