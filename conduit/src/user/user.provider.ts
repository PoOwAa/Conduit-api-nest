import { dbRepositories } from '../database/database.constants';
import { User } from './user.entity';

export const userProviders = [
  {
    provide: dbRepositories.userRepository,
    useValue: User,
  },
];
