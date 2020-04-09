import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.dto';

export class LoginResponseDto extends User {
  @ApiProperty()
  token: string;
}
