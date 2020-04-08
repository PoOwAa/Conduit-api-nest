import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/guard/local-auth.guard';
import { CreateUserDto } from './dto/create.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiTags('User')
@Controller()
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('users')
  @ApiOperation({
    summary: 'Create new user',
    description: 'Registration endpoint, to create a brand new user',
  })
  async registrateUser(@Body('user') userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    description: 'User login via credentials',
  })
  @ApiUnauthorizedResponse({
    description: 'Wrong e-mail or password',
  })
  @ApiResponse({
    description: 'Successful login',
    type: LoginResponseDto,
    status: 200,
  })
  @HttpCode(HttpStatus.OK)
  @Post('users/login')
  async login(@Body('user') credentials: LoginDto): Promise<LoginResponseDto> {
    const user = await this.authService.validateUser(credentials);

    if (!user) {
      throw new BadRequestException(`Invalid username or password`);
    }

    return this.authService.login(user);
  }

  @Get('user')
  async getCurrentUser() {
    return `CurrentUser`;
  }

  @Put('user')
  async updateUser(@Body('user') userData: Partial<User>) {
    return `Update user!`;
  }

  @Post('test')
  async swaggerTest(@Body() asd: LoginDto) {}
}
