import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.dto';

export class UserResponseDto {
  @ApiProperty()
  user: User;

  constructor(user: User) {
    this.user = user;
    delete this.user.id;
    delete this.user.password;
  }
}
