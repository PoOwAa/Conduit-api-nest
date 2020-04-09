import { dbRepositories } from '../database/database.constants';
import { UserEntity } from './user.entity';

export const userProviders = [
  {
    provide: dbRepositories.userRepository,
    useValue: UserEntity,
  },
];
