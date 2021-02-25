import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  AllowNull,
  Default,
  CreatedAt,
  UpdatedAt,
  HasMany,
  ForeignKey,
  BelongsToMany,
  BelongsTo,
  HasOne
} from 'sequelize-typescript';
import { ID, Field, ObjectType } from '@nestjs/graphql';
import { CitiesEnum, GenderEnum, LangEnum, StatusEnum, UserRoleEnum } from '../user.enum';
import { FcmTokensType, LastLoginDetails, LocationType } from '../user.type';
import { Notification } from 'src/notification/models/notification.model';
import { NotificationManagerEnum } from 'src/notification/notification.enum';
import { NotificationUserStatus } from 'src/notification/models/notification-user-status.model';
import { UserVerificationCode } from './user-verification-code.model';
import { paginate } from 'src/_common/paginator/paginator.service';
import { NotificationManager } from 'src/notification/notification.type';
import { SecurityGroup } from 'src/security-group/security-group.model';
import { IsPhoneNumber } from 'class-validator';
import { getColumnEnum } from 'src/_common/utils/columnEnum';
import { School } from 'src/school/models/school.model';
import { Teacher } from 'src/teacher/models/teacher.model';
import { Timestamp } from 'src/_common/graphql/timestamp.scalar';
import { File } from 'src/_common/uploader/file.model';
import { IPaginateInput } from 'src/_common/paginator/paginator.interface';

@Table({
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: [{ name: 'role' }, { name: 'isBlocked' }, { name: 'location' }] },
    { fields: [{ name: 'firstName' }, { name: 'lastName' }, { name: 'email' }, { name: 'phone' }] }
  ]
})
@ObjectType()
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  @Field(() => ID)
  id: string;

  @AllowNull(false)
  @Column
  @Field()
  firstName: string;

  @AllowNull(true)
  @Column
  @Field({ nullable: true })
  lastName?: string;

  @Column
  @Field({ nullable: true })
  slug?: string;

  @AllowNull(true)
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  @Field(() => [String], { nullable: 'itemsAndList' })
  rejectionReasons?: string[];

  @AllowNull(true)
  @Column({
    set(val: string) {
      if (val) (this as any).setDataValue('email', val.toLocaleLowerCase());
    }
  })
  @Field({ nullable: true })
  email?: string;

  @AllowNull(false)
  @Default(StatusEnum.PENDING)
  @Column({ type: getColumnEnum(StatusEnum) })
  @Field(() => StatusEnum)
  status: StatusEnum;

  @Default(false)
  @AllowNull(false)
  @Column
  @Field()
  isEmailVerified: boolean;

  @IsPhoneNumber('ZZ')
  @Column
  @Field({ nullable: true })
  phone?: string;

  @IsPhoneNumber('ZZ')
  @Column
  @Field({ nullable: true })
  unverifiedPhone?: string;

  @AllowNull(false)
  @Column
  password: string;

  @Default(GenderEnum.MALE)
  @AllowNull(false)
  @Column({ type: getColumnEnum(GenderEnum) })
  @Field(() => GenderEnum)
  gender: GenderEnum;

  @Column({ type: DataType.DATE })
  @Field(() => Timestamp, { nullable: true })
  birthDate?: Date;

  @AllowNull(false)
  @Column({ type: getColumnEnum(UserRoleEnum) })
  @Field(() => UserRoleEnum)
  role: UserRoleEnum;

  @Column({ type: DataType.GEOGRAPHY('Point', 4326) })
  @Field(() => LocationType, { nullable: true })
  location?: LocationType;

  @Column
  @Field({ nullable: true })
  city?: string;

  @Default('/default/avatar.png')
  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  @Field({ nullable: true })
  profilePicture?: string;

  @Default(false)
  @AllowNull(false)
  @Column
  @Field()
  isBlocked: boolean;

  @Default(LangEnum.EN)
  @AllowNull(false)
  @Column({ type: getColumnEnum(LangEnum) })
  @Field(() => LangEnum)
  favLang: LangEnum;

  @AllowNull(true)
  @ForeignKey(() => SecurityGroup)
  @Column({ type: DataType.UUID, onDelete: 'SET NULL', onUpdate: 'SET NULL' })
  securityGroupId: string;

  @BelongsTo(() => SecurityGroup)
  @Field(() => SecurityGroup, { nullable: true })
  securityGroup?: SecurityGroup;

  @Default({ android: null, ios: null, desktop: null })
  @AllowNull(false)
  @Column({ type: DataType.JSONB })
  fcmTokens: FcmTokensType;

  @HasMany(() => UserVerificationCode, 'userId')
  userVerificationCodes: UserVerificationCode[];

  @BelongsToMany(() => Notification, () => NotificationUserStatus)
  notifications: Array<Notification & { NotificationUserStatus: NotificationUserStatus }>;

  @Default(
    Object.keys(NotificationManagerEnum).reduce((total, k) => {
      total[k] = true;
      return total;
    }, {})
  )
  @AllowNull(false)
  @Column({ type: DataType.JSONB })
  @Field(() => NotificationManager)
  notificationManager: NotificationManager;

  @Field({ nullable: true })
  token?: string;

  @AllowNull(true)
  @Column({ type: DataType.JSONB })
  @Field(() => LastLoginDetails, { nullable: true })
  lastLoginDetails?: LastLoginDetails;

  @HasMany(() => File)
  file?: File[];

  @HasOne(() => School)
  @Field(() => School, { nullable: true })
  school: School;

  @HasOne(() => Teacher)
  @Field(() => Teacher, { nullable: true })
  teacher?: Teacher;

  @CreatedAt
  @Column({ type: DataType.DATE })
  @Field(() => Timestamp)
  createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  @Field(() => Timestamp)
  updatedAt: Date;

  static async paginate(input: IPaginateInput) {
    return paginate<Notification>(this, input);
  }
}
