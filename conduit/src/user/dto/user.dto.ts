import { ApiProperty } from '@nestjs/swagger';
import { UserFollowEntity } from 'src/profile/user-follow.entity';
import { UserEntity } from '../user.entity';

export class User {
  id?: number;

  @ApiProperty()
  username: string;

  password?: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  bio: string;

  @ApiProperty()
  image: string;

  following?: UserFollowEntity[];

  constructor(user: UserEntity) {
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
