import { ApiProperty } from '@nestjs/swagger';
import { FollowingEntity } from 'src/profile/following.entity';
import { UserEntity } from '../user.entity';

export class User {
  @ApiProperty()
  id?: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  password?: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  bio: string;
  @ApiProperty()
  image: string;
  @ApiProperty()
  following?: FollowingEntity[];

  constructor(user: Partial<UserEntity>) {
    this.id = user?.id;
    this.username = user?.username;
    this.password = user?.password;
    this.email = user?.email;
    this.bio = user?.bio;
    this.image = user?.image;
    if (user.following) {
      this.following = user.following;
    }
  }
}
