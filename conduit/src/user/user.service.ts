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
import { User } from './dto/user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  private readonly loggerService: Logger = new Logger(UserService.name);

  constructor(
    @Inject(dbRepositories.userRepository)
    private userRepository: typeof UserEntity,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.findAll<UserEntity>();
    return users ? users.map(u => new User(u)) : users;
  }

  async findOne(...args): Promise<User> {
    const user = await this.userRepository.findOne<UserEntity>(...args);
    return user ? new User(user) : user;
  }

  async findByPk(id: number): Promise<User> {
    const user = await this.userRepository.findByPk<UserEntity>(id);
    return user ? new User(user) : user;
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne<UserEntity>({
      where: {
        username,
      },
    });

    return user ? new User(user) : user;
  }

  async create(regData: CreateUserDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findOne<UserEntity>({
      where: {
        [Op.or]: [{ username: regData.username }, { email: regData.email }],
      },
    });

    if (user) {
      throw new BadRequestException(`User already exists!`);
    }

    const newUser = new UserEntity({
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

  async update(id: number, updatedUser: Partial<User>): Promise<User> {
    const userEntity = await this.userRepository.findByPk<UserEntity>(id);
    for (const prop in updatedUser) {
      if (updatedUser.hasOwnProperty(prop)) {
        userEntity[prop] = updatedUser[prop];
      }
    }

    if (updatedUser.password) {
      await userEntity.setPassword(updatedUser.password);
    }

    await userEntity.save();
    const user = new User(userEntity);
    delete user.password;
    return user;
  }
}
