import { ApiProperty } from '@nestjs/swagger';
import { LoginDto } from './login.dto';

export class LoginResponseDto {
  @ApiProperty()
  user: LoginDto;

  constructor(user: LoginDto) {
    this.user = user;
  }
}
