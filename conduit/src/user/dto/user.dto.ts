import { ApiProperty } from '@nestjs/swagger';
import { JWTService } from 'src/auth/jwt.service';
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

  @ApiProperty()
  token?: string;

  constructor(user: UserEntity) {
    const jwtService: JWTService = JWTService.getInstance();

    this.id = user?.id;
    this.username = user?.username;
    this.password = user?.password;
    this.email = user?.email;
    this.bio = user?.bio;
    this.image = user?.image;
    if (user.following) {
      this.following = user.following;
    }

    this.token = jwtService.createToken(this);
  }
}
