import * as Joi from '@hapi/joi';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mysqlConfig from './mysql.config';
import { MysqlConfigService } from './mysqlConfig.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [mysqlConfig],
      validationSchema: Joi.object({
        DATABASE_NAME: Joi.string().default('conduit'),
        DATABASE_PORT: Joi.number().default(3306),
        DATABASE_HOST: Joi.string().default('localhost'),
        DATABASE_USER: Joi.string(),
        DATABASE_PASS: Joi.string(),
      }),
    }),
  ],
  providers: [ConfigService, MysqlConfigService],
  exports: [ConfigService, MysqlConfigService],
})
export class MysqlConfigModule {}
