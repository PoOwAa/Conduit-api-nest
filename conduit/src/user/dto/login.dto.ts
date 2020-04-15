import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  token: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  bio: string;
  @ApiProperty()
  image: string;
}
