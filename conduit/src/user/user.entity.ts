import * as argon2 from 'argon2';
import {
  AllowNull,
  AutoIncrement,
  BeforeCreate,
  Column,
  DataType,
  IsEmail,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
@Table({
  tableName: 'user',
  timestamps: true,
})
export class UserEntity extends Model<UserEntity> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Unique
  @AllowNull(false)
  @Column
  username: string;

  @AllowNull(false)
  @Column
  password: string;

  @Unique
  @AllowNull(false)
  @IsEmail
  @Column
  email: string;

  @Column(DataType.TEXT)
  bio: string;

  @Column
  image: string;

  @BeforeCreate
  static async hashPassword(instance: UserEntity) {
    instance.password = await argon2.hash(instance.password);
  }

  async setPassword(password: string) {
    this.password = await argon2.hash(password);
  }
}
