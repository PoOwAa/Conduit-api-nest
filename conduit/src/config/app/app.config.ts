import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.APP_ENV,
  name: process.env.APP_NAME,
  port: process.env.APP_PORT,
  jwtSecret: process.env.JWT_SECRET,
}));
