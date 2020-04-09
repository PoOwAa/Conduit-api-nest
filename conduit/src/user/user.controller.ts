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
  Req,
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
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthMeta } from 'src/auth/interface/authMeta.interface';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
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
  async registrateUser(@Body('user') userData: CreateUserDto) {
    const user = await this.userService.create(userData);
    return new UserResponseDto(user);
  }

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
  async login(@Body('user') credentials: LoginDto): Promise<UserResponseDto> {
    const user = await this.authService.validateUser(credentials);

    if (!user) {
      throw new BadRequestException(`Invalid username or password`);
    }

    const res = await this.authService.login(user);
    return new UserResponseDto(res);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Token')
  @Get('user')
  async getCurrentUser(@Req() request: Request) {
    const user: AuthMeta = request.user as AuthMeta;

    return new UserResponseDto(await this.userService.findByPk(user.userId));
  }

  @UseGuards(JwtAuthGuard)
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
  @Put('user')
  async updateUser(
    @Req() request: Request,
    @Body('user') userData: Partial<User>,
  ) {
    const user: AuthMeta = request.user as AuthMeta;
    const res = await this.userService.update(user.userId, userData);
    return new UserResponseDto(res);
  }
}
