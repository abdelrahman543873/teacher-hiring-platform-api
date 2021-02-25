import {
  Table,
  Model,
  BelongsTo,
  DataType,
  ForeignKey,
  Column,
  AllowNull,
  Default,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  BelongsToMany,
  HasMany
} from 'sequelize-typescript';
import { User } from '../../user/models/user.model';
import { getColumnEnum } from '../../_common/utils/columnEnum';
import { EducationalGradesEnum } from '../../teacher/teacher.enums';
import { LocationType } from '../../user/user.type';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { SchoolGenderEnum, SchoolTypeEnum } from '../school.enum';
import { paginate } from 'src/_common/paginator/paginator.service';
import { IsPhoneNumber } from 'class-validator';
import { Timestamp } from 'src/_common/graphql/timestamp.scalar';
import { Curriculum } from '../../curriculum/models/curriculum.model';
import { SchoolCurriculum } from '../../curriculum/models/school-curriculum.model';
import { IPaginateInput } from 'src/_common/paginator/paginator.interface';
import { Review } from 'src/review/review.model';
import { ReviewableEnum } from 'src/review/review.enum';

@Table({
  timestamps: true,
  paranoid: true,
  indexes: []
})
@ObjectType()
export class School extends Model<School> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  @Field(() => ID)
  id: string;

  @BelongsToMany(() => Curriculum, () => SchoolCurriculum)
  @Field(() => [Curriculum], { nullable: 'itemsAndList' })
  curriculums?: Curriculum[];

  @AllowNull(false)
  @Column
  @Field()
  name: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  @Field(() => ID)
  schoolAdminId: string;

  @IsPhoneNumber('ZZ')
  @AllowNull(false)
  @Column
  @Field()
  phone: string;

  @AllowNull(false)
  @Column
  @Field()
  landlineNumber: string;

  @AllowNull(false)
  @Column({
    set(val: string) {
      if (val) (this as any).setDataValue('email', val.toLocaleLowerCase());
    }
  })
  @Field()
  email: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(getColumnEnum(SchoolTypeEnum)) })
  @Field(() => SchoolTypeEnum)
  schoolType: SchoolTypeEnum;

  @AllowNull(false)
  @Field()
  @Column({ type: DataType.TEXT })
  city: string;

  @Default(`/default/avatar.png`)
  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  @Field({ nullable: true })
  profilePicture?: string;

  @AllowNull(true)
  @Column({ type: DataType.ARRAY(getColumnEnum(EducationalGradesEnum)) })
  @Field(() => [EducationalGradesEnum], { nullable: 'itemsAndList' })
  grades?: EducationalGradesEnum[];

  @AllowNull(true)
  @Column({ type: getColumnEnum(SchoolGenderEnum) })
  @Field(() => SchoolGenderEnum, { nullable: true })
  gender?: SchoolGenderEnum;

  @AllowNull(true)
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  @Field(() => [String], { nullable: 'itemsAndList' })
  certificates?: string[];

  @AllowNull(true)
  @Column({ type: DataType.GEOGRAPHY('Point', 4326) })
  @Field(() => LocationType, { nullable: true })
  location?: LocationType;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  @Field({ nullable: true })
  arAddress?: string;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  @Field({ nullable: true })
  enAddress?: string;

  @HasMany(() => Review, {
    foreignKey: 'reviewableId',
    constraints: false,
    scope: { reviewableType: ReviewableEnum.SCHOOL }
  })
  reviewable?: Review[];

  @HasMany(() => Review, {
    foreignKey: 'reviewerId',
    constraints: false,
    scope: { reviewerType: ReviewableEnum.SCHOOL }
  })
  reviewer?: Review[];

  @AllowNull(true)
  @Column({ type: DataType.FLOAT })
  @Field({ nullable: true })
  avgRate: number;

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
