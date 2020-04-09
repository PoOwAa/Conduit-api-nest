import { User } from './user.dto';

export class UserResponseDto {
  constructor(readonly user: Partial<User>) {
    delete this.user.password;
  }
}
