import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { School } from 'src/school/models/school.model';
import { Teacher } from 'src/teacher/models/teacher.model';
import { Timestamp } from 'src/_common/graphql/timestamp.scalar';
import { IPaginateInput } from 'src/_common/paginator/paginator.interface';
import { paginate } from 'src/_common/paginator/paginator.service';
import { getColumnEnum } from 'src/_common/utils/columnEnum';
import { ReviewableEnum, ReviewerEnum } from './review.enum';

@Table({
  timestamps: true,
  paranoid: true,
  indexes: []
})
@ObjectType()
export class Review extends Model<Review> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  @Field(() => ID)
  id: string;

  @BelongsTo(() => School, {
    constraints: false,
    scope: { reviewerType: ReviewerEnum.SCHOOL }
  })
  schoolReviewer: School;

  @BelongsTo(() => Teacher, {
    constraints: false,
    scope: { reviewerType: ReviewerEnum.TEACHER }
  })
  teacherReviewer: Teacher;

  @ForeignKey(() => School)
  @ForeignKey(() => Teacher)
  @Column({ type: DataType.UUID })
  reviewerId: string;

  @Column({ type: getColumnEnum(ReviewerEnum) })
  reviewerType: ReviewerEnum;

  @BelongsTo(() => School, {
    constraints: false,
    scope: { reviewableType: ReviewableEnum.SCHOOL }
  })
  schoolReviewable: School;

  @BelongsTo(() => Teacher, {
    constraints: false,
    scope: { reviewableType: ReviewableEnum.TEACHER }
  })
  teacherReviewable: Teacher;

  @ForeignKey(() => School)
  @ForeignKey(() => Teacher)
  @Column({ type: DataType.UUID })
  reviewableId: string;

  @Column({ type: getColumnEnum(ReviewableEnum) })
  reviewableType: ReviewableEnum;

  @Default(0)
  @Column({ type: DataType.FLOAT })
  @Field()
  rate: number;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  @Field({ nullable: true })
  content?: string;

  @CreatedAt
  @Column({ type: DataType.DATE })
  @Field(() => Timestamp)
  createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  @Field(() => Timestamp)
  updatedAt: Date;

  static async paginate(input: IPaginateInput) {
    return paginate<Review>(this, input);
  }
}
