import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  Default,
  BelongsTo,
  AllowNull
} from 'sequelize-typescript';
import { User } from './user.model';
import { UserVerificationCodeUserCaseEnum } from '../user.enum';
import { getColumnEnum } from 'src/_common/utils/columnEnum';

@Table({ timestamps: true })
export class UserVerificationCode extends Model<UserVerificationCode> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id: string;

  @Default(UserVerificationCodeUserCaseEnum.PASSWORD_RESET)
  @AllowNull(false)
  @Column({ type: getColumnEnum(UserVerificationCodeUserCaseEnum) })
  useCase: UserVerificationCodeUserCaseEnum;

  @AllowNull(false)
  @Column
  code: string;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  expiryDate: Date;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ onDelete: 'CASCADE', onUpdate: 'CASCADE', type: DataType.UUID })
  userId: string;

  @BelongsTo(() => User, 'userId')
  user: User;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;
}
