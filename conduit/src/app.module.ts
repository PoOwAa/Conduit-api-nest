import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config/app/appConfig.module';
import { MysqlConfigModule } from './config/database/mysql/mysqlConfig.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AppConfigModule, MysqlConfigModule, UserModule, AuthModule],
})
export class AppModule {}
