import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { UserEntity } from 'src/user/user.entity';
import { TagEntity } from './tag.entity';

@Table({
  tableName: 'article',
  timestamps: true,
})
export class ArticleEntity extends Model<ArticleEntity> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  slug: string;

  @Column
  title: string;

  @Column
  description: string;

  @Column
  body: string;

  @HasMany(() => TagEntity)
  tagList: string[];

  @ForeignKey(() => UserEntity)
  @Column
  userId: number;

  favoritedCount: number;

  @BelongsTo(() => UserEntity)
  author: UserEntity;

  @HasMany(() => TagEntity)
  tags: TagEntity[];
}
