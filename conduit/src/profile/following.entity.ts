import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserEntity } from 'src/user/user.entity';

@Table({
  tableName: 'following',
  timestamps: false,
})
export class FollowingEntity extends Model<FollowingEntity> {
  @ForeignKey(() => UserEntity)
  @Column
  userId: number;

  @ForeignKey(() => UserEntity)
  @Column
  followingId: number;

  @BelongsTo(() => UserEntity)
  user: UserEntity;
}
