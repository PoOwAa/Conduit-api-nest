import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Profile } from './dto/profile.dto';
import { FollowingEntity } from './following.entity';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private readonly userService: UserService) {}

  async getProfile(username: string): Promise<Profile | null> {
    const user = await this.userService.findOneByUsername(username);
    return user ? new Profile(user) : null;
  }

  async isFollowing(id: number, followingUserId: number) {
    if (id === followingUserId) {
      return false;
    }

    const user = await this.userService.findOne({
      include: [FollowingEntity],
      where: {
        id,
      },
    });

    for (const following of user.following) {
      if (followingUserId === following.followingId) {
        return true;
      }
    }
    return false;
  }
}
