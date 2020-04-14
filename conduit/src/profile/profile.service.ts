import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Profile } from './dto/profile.dto';
import { UserFollowEntity } from './user-follow.entity';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private readonly userService: UserService) {}

  async getProfile(username: string, userId?: number): Promise<Profile | null> {
    const user = await this.userService.findOneByUsername(username);

    if (user) {
      const profile = new Profile(user);
      if (userId) {
        profile.following = await this.isFollowing(userId, user.id);
      }
      return profile;
    }
    return null;
  }

  async isFollowing(userId: number, followingUserId: number) {
    if (userId === followingUserId) {
      return false;
    }

    const user = await this.userService.findOne({
      include: [UserFollowEntity],
      where: {
        id: userId,
      },
    });

    for (const following of user.following) {
      if (followingUserId === following.followingId) {
        return true;
      }
    }
    return false;
  }

  async followUser(userId: number, username: string) {
    const followingUser = await this.userService.findOne({
      where: {
        username,
      },
    });

    if (userId === followingUser.id) {
      return true;
    }

    if (await this.isFollowing(userId, followingUser.id)) {
      return true;
    }

    const following: UserFollowEntity = new UserFollowEntity({
      userId,
      followingId: followingUser.id,
    });

    await following.save();

    return true;
  }

  async unFollowUser(userId: number, username: string) {
    const followingUser = await this.userService.findOne({
      where: {
        username,
      },
    });

    if (userId === followingUser.id) {
      return true;
    }

    if (!(await this.isFollowing(userId, followingUser.id))) {
      const me = await this.userService.find({
        include: [UserFollowEntity],
        where: {
          id: userId,
        },
      });

      for (const following of me.following) {
        if (followingUser.id === following.followingId) {
          await following.destroy();
        }
      }
    }

    return true;
  }
}
