import { Provider } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ArticleFollowEntity } from 'src/article/article-follow.entity';
import { ArticleEntity } from 'src/article/article.entity';
import { TagEntity } from 'src/article/tag.entity';
import { UserFollowEntity } from 'src/profile/user-follow.entity';
import { AppConfigService } from '../config/app/appConfig.service';
import { MysqlConfigService } from '../config/database/mysql/mysqlConfig.service';
import { UserEntity } from '../user/user.entity';

export const databaseProviders: Provider[] = [
  {
    provide: 'MySQL',
    inject: [MysqlConfigService, AppConfigService],
    useFactory: async (
      dbConfig: MysqlConfigService,
      appConfig: AppConfigService,
    ) => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.databaseName,
        pool: {
          min: 1,
          max: 5,
          idle: 5000,
        },
        logging: appConfig.env === 'development' ? console.log : false,
      });

      sequelize.addModels([
        UserEntity,
        UserFollowEntity,
        ArticleEntity,
        ArticleFollowEntity,
        TagEntity,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
