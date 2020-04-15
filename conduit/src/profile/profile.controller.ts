import { Controller, Delete, Get, HttpCode, HttpStatus, Logger, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthMeta } from 'src/auth/interface/authMeta.interface';
import { ErrorDto } from 'src/shared/error/error.dto';
import { UserMeta } from 'src/user/decorator/user-meta.decorator';
import { UserService } from 'src/user/user.service';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@ApiBearerAuth('Token')
@Controller('profiles')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({
    summary: 'Get a profile',
    description: `Get a users profile. Authentication is optional. If JWT provided, the 'following' property
    shows if the user is followed by you`,
  })
  @ApiResponse({
    description: 'Profile not found',
    type: ErrorDto,
    status: HttpStatus.NOT_FOUND,
  })
  @Get(':username')
  async getProfile(
    @UserMeta() me: AuthMeta,
    @Param('username') username: string,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profileService.getProfile(username, me?.userId);

    if (!profile) {
      throw new NotFoundException();
    }
    return new ProfileResponseDto(profile);

  }

  @ApiOperation({
    summary: 'Follow a user',
    description: 'Follow a user. Returns the following users profile',
  })
  @ApiResponse({
    description: 'Profile not found',
    type: ErrorDto,
    status: HttpStatus.NOT_FOUND,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('Token')
  @Post(':username/follow')
  async followUser(
    @UserMeta() me: AuthMeta,
    @Param('username') username: string,
  ): Promise<ProfileResponseDto> {
    await this.profileService.followUser(me.userId, username);

    const profile = await this.profileService.getProfile(username, me.userId);

    if (!profile) {
      throw new NotFoundException();
    }
    return new ProfileResponseDto(profile);

  }

  @ApiOperation({
    summary: 'Unfollow a user',
    description: 'Unfollow a user. Returns the unfollowed users profile',
  })
  @ApiResponse({
    description: 'Profile not found',
    type: ErrorDto,
    status: HttpStatus.NOT_FOUND,
  })
  @ApiBearerAuth('Token')
  @Delete(':username/follow')
  async unFollowUser(
    @UserMeta() me: AuthMeta,
    @Param('username') username: string,
  ): Promise<ProfileResponseDto> {
    await this.profileService.unFollowUser(me.userId, username);

    const profile = await this.profileService.getProfile(username, me.userId);

    if (!profile) {
      throw new NotFoundException();
    }
    return new ProfileResponseDto(profile);

  }
}
