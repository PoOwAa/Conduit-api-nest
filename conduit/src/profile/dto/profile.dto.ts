import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/dto/user.dto';

export class Profile {
  @ApiProperty()
  username: string;
  @ApiProperty()
  bio: string;
  @ApiProperty()
  image: string;
  @ApiProperty()
  following: boolean = false;

  constructor(user: User) {
    this.username = user.username;
    this.bio = user.bio;
    this.image = user.image;
  }
}
