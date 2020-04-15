import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthMeta } from 'src/auth/interface/authMeta.interface';
import { ErrorDto } from 'src/shared/error/error.dto';
import { AuthService } from '../auth/auth.service';
import { UserMeta } from './decorator/user-meta.decorator';
import { CreateUserDto } from './dto/create.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './dto/user.dto';
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
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UserResponseDto,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user: {
          properties: {
            username: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            password: {
              type: 'string',
            },
          },
          required: ['username', 'email', 'password'],
        },
      },
      required: ['user'],
    },
  })
  async registrateUser(
    @Body('user') userData: CreateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.create(userData);
    return new UserResponseDto(user);
  }

  @ApiOperation({
    summary: 'Login',
    description: 'User login via credentials',
  })
  @ApiUnauthorizedResponse({
    description: 'Wrong e-mail or password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user: {
          properties: {
            email: {
              type: 'string',
            },
            password: {
              type: 'string',
            },
          },
          required: ['email', 'password'],
        },
      },
      required: ['user'],
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('users/login')
  async login(
    @Body('user') credentials: LoginRequestDto,
  ): Promise<UserResponseDto> {
    const user = await this.authService.validateUser(credentials);

    if (!user) {
      throw new BadRequestException(`Invalid username or password`);
    }

    const res = await this.authService.login(user);
    return new UserResponseDto(res);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Token')
  @ApiOperation({
    summary: 'Get the current user',
    description: 'Returns the logged in user data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
  })
  @ApiResponse({
    description: 'User not found',
    type: ErrorDto,
    status: HttpStatus.NOT_FOUND,
  })
  @Get('user')
  async getCurrentUser(@UserMeta() me: AuthMeta): Promise<UserResponseDto> {
    const user = await this.userService.findByPk(me.userId);

    if (!user) {
      throw new NotFoundException();
    }

    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update the user',
    description: 'Accepted fields: email, username, password, image, bio',
  })
  @ApiResponse({
    description: 'User not found',
    type: ErrorDto,
    status: HttpStatus.NOT_FOUND,
  })
  @ApiBearerAuth('Token')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user: {
          properties: {
            email: {
              type: 'string',
            },
            username: {
              type: 'string',
            },
            password: {
              type: 'string',
            },
            image: {
              type: 'string',
            },
            bio: {
              type: 'string',
            },
          },
        },
      },
      required: ['user'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
  })
  @ApiResponse({
    description: 'User not found',
    type: ErrorDto,
    status: HttpStatus.NOT_FOUND,
  })
  @HttpCode(HttpStatus.OK)
  @Put('user')
  async updateUser(
    @UserMeta() me: AuthMeta,
    @Body('user') userData: Partial<User>,
  ): Promise<UserResponseDto> {
    const user = await this.userService.update(me.userId, userData);

    if (!user) {
      throw new NotFoundException();
    }

    return new UserResponseDto(user);
  }
}
