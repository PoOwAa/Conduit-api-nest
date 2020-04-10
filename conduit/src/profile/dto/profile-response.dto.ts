import { Profile } from './profile.dto';

export class ProfileResponseDto {
  constructor(readonly profile: Profile) {}
}
