import { ApiProperty } from '@nestjs/swagger';
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

  constructor(user: Partial<UserEntity>) {
    this.id = user?.id;
    this.username = user?.username;
    this.password = user?.password;
    this.email = user?.email;
    this.bio = user?.bio;
    this.image = user?.image;
  }
}
