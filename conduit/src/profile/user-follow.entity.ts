import { ApiHideProperty } from '@nestjs/swagger';
import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { UserEntity } from 'src/user/user.entity';

@Table({
  tableName: 'userFollow',
  timestamps: false,
})
export class UserFollowEntity extends Model<UserFollowEntity> {
  @ApiHideProperty()
  @ForeignKey(() => UserEntity)
  @Column
  userId: number;

  @ApiHideProperty()
  @ForeignKey(() => UserEntity)
  @Column
  followingId: number;

  // @ApiHideProperty()
  // @BelongsTo(() => UserEntity)
  // user: UserEntity;
}
