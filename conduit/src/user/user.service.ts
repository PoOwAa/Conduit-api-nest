import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { AuthService } from '../auth/auth.service';
import { dbRepositories } from '../database/database.constants';
import { CreateUserDto } from './dto/create.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private readonly loggerService: Logger = new Logger(UserService.name);

  constructor(
    @Inject(dbRepositories.userRepository) private userRepository: typeof User,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll<User>();
  }

  async findOne(...args): Promise<User> {
    return this.userRepository.findOne<User>(...args);
  }

  async findByPk(id: number): Promise<User> {
    return this.userRepository.findByPk<User>(id);
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.userRepository.findOne<User>({
      where: {
        username,
      },
    });
  }

  async create(regData: CreateUserDto): Promise<LoginResponseDto> {
    const user = this.userRepository.findOne<User>({
      where: {
        [Op.or]: [{ username: regData.username }, { email: regData.email }],
      },
    });

    if (user) {
      throw new BadRequestException(`User already exists!`);
    }

    const newUser = new User({
      username: regData.username,
      email: regData.email,
      password: regData.password,
    });

    try {
      await newUser.save();
    } catch (err) {
      this.loggerService.error(err);
      throw new BadRequestException(`Couldn't create user!`);
    }

    return this.authService.login(newUser);
  }
}
