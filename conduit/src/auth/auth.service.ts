import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import * as argon2 from 'argon2';
import { User } from 'src/user/dto/user.dto';
import { LoginResponseDto } from '../user/dto/login-response.dto';
import { LoginDto } from '../user/dto/login.dto';
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

  async validateUser(credentials: LoginDto): Promise<User> {
    const user = await this.userService.findOne({
      where: {
        email: credentials.email,
      },
    });

    if (user) {
      this.logger.debug(typeof user);
      this.logger.debug(typeof user.password);
      if (await argon2.verify(user.password, credentials.password)) {
        const result = new User(user);
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
      bio: user.bio || null,
      image: user.image || null,
    };

    return res;
  }
}
