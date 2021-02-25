import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  AllowNull,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  BelongsToMany,
  HasMany
} from 'sequelize-typescript';
import { Timestamp } from 'src/_common/graphql/timestamp.scalar';
import { User } from '../../user/models/user.model';
import { getColumnEnum } from '../../_common/utils/columnEnum';
import { EducationalGradesEnum } from '../teacher.enums';
import { Subject } from '../../subject/models/subject.model';
import { TeacherSubject } from '../../subject/models/teacher-subject.model';
import { Curriculum } from '../../curriculum/models/curriculum.model';
import { TeacherCurriculum } from '../../curriculum/models/teacher-curriculum.model';
import { ReviewableEnum } from 'src/review/review.enum';
import { Review } from 'src/review/review.model';

@Table({
  timestamps: true,
  paranoid: true,
  indexes: []
})
@ObjectType()
export class Teacher extends Model<Teacher> {
  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  @PrimaryKey
  @Column({ type: DataType.UUID })
  @Field(() => ID)
  teacherId: string;

  @BelongsToMany(() => Subject, () => TeacherSubject)
  @Field(() => [Subject])
  subjects: Subject[];

  @AllowNull(false)
  @Default(0)
  @Column
  @Field()
  experience: number;

  @AllowNull(false)
  @Column({ type: DataType.ARRAY(getColumnEnum(EducationalGradesEnum)) })
  @Field(() => [EducationalGradesEnum])
  grades: EducationalGradesEnum[];

  @BelongsToMany(() => Curriculum, () => TeacherCurriculum)
  @Field(() => [Curriculum])
  curriculums: Curriculum[];

  @AllowNull(false)
  @Column
  @Field()
  cv: string;

  @AllowNull(false)
  @Column
  @Field()
  idDocument: string;

  @AllowNull(false)
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  @Field(() => [String])
  certificates: string[];

  @Column({ type: DataType.TEXT })
  @Field({ nullable: true })
  arAddress?: string;

  @Column({ type: DataType.TEXT })
  @Field({ nullable: true })
  enAddress?: string;

  @AllowNull(true)
  @Column({ type: DataType.FLOAT })
  @Field({ nullable: true })
  avgRate: number;

  @HasMany(() => Review, {
    constraints: false,
    scope: { reviewableType: ReviewableEnum.TEACHER }
  })
  reviewable?: Review[];

  @HasMany(() => Review, {
    constraints: false,
    scope: { reviewerType: ReviewableEnum.TEACHER }
  })
  reviewer?: Review[];

  @CreatedAt
  @Column({ type: DataType.DATE })
  @Field(() => Timestamp, { nullable: true })
  createdAt?: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  @Field(() => Timestamp, { nullable: true })
  updatedAt?: Date;
}
