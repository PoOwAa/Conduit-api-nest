import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ArticleEntity } from './article.entity';

@Table({
  tableName: 'tag',
  timestamps: false,
})
export class TagEntity extends Model<TagEntity> {
  @ForeignKey(() => ArticleEntity)
  @Column
  articleId: number;

  @Column
  tag: string;

  @BelongsTo(() => ArticleEntity)
  article: ArticleEntity;
}
