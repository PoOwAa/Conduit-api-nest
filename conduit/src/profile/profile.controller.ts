import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthMeta } from 'src/auth/interface/authMeta.interface';
import { UserMeta } from 'src/user/decorator/user-meta.decorator';
import { UserService } from 'src/user/user.service';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { Profile } from './dto/profile.dto';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@Controller('profiles')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
  ) {}

  @ApiBearerAuth('Token')
  @Get(':username')
  async getProfile(
    @UserMeta() me: AuthMeta,
    @Query('username') username: string,
  ) {
    const user = await this.userService.findOneByUsername(username);

    const profile = new Profile(user);
    profile.following = await this.profileService.isFollowing(
      me.userId,
      user.id,
    );

    return new ProfileResponseDto(profile);
  }
}
