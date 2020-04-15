import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import * as argon2 from 'argon2';
import { LoginDto } from 'src/user/dto/login.dto';
import { User } from 'src/user/dto/user.dto';
import { LoginRequestDto } from '../user/dto/login-request.dto';
import { UserService } from '../user/user.service';
import { JWTService } from './jwt.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JWTService,
  ) {}

  async validateUser(credentials: LoginRequestDto): Promise<User> {
    const user = await this.userService.findOne({
      where: {
        email: credentials.email,
      },
    });

    if (user) {
      if (await argon2.verify(user.password, credentials.password)) {
        return user;
      }
    }
    return null;
  }

  async login(user: User): Promise<LoginDto> {
    const token = await this.jwtService.createToken(user);

    const res: LoginDto = {
      email: user.email,
      token,
      username: user.username,
      bio: user.bio || null,
      image: user.image || null,
    };

    return res;
  }
}
