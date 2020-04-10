import { Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthMeta } from 'src/auth/interface/authMeta.interface';
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

  @Get(':username')
  async getProfile(
    @UserMeta() me: AuthMeta,
    @Query('username') username: string,
  ) {
    const profile = await this.profileService.getProfile(username, me?.userId);
    return new ProfileResponseDto(profile);
  }

  @ApiBearerAuth('Token')
  @Post(':username/follow')
  async changeFollow(
    @UserMeta() me: AuthMeta,
    @Query('username') username: string,
  ) {
      await this.profileService.changeFollow(me.userId, username);

      return this.profileService.getProfile(username, me.userId);
  }
}
