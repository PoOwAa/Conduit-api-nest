import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserEntity } from 'src/user/user.entity';
import { ArticleEntity } from './article.entity';

@Table({
  tableName: 'articleFollow',
  timestamps: false,
})
export class ArticleFollowEntity extends Model<ArticleFollowEntity> {
  @ForeignKey(() => UserEntity)
  @Column
  userId: number;

  @ForeignKey(() => ArticleEntity)
  @Column
  articleId: number;

  @BelongsTo(() => UserEntity)
  user: UserEntity;

  @BelongsTo(() => ArticleEntity)
  article: ArticleEntity;
}
