import {
  Table,
  Model,
  BelongsToMany,
  PrimaryKey,
  DataType,
  Column,
  Default,
  Unique
} from 'sequelize-typescript';
import { School } from '../../school/models/school.model';
import { SchoolCurriculum } from './school-curriculum.model';
import { ID, Field, ObjectType } from '@nestjs/graphql';
import { Teacher } from '../../teacher/models/teacher.model';
import { TeacherCurriculum } from './teacher-curriculum.model';

@Table
@ObjectType()
export class Curriculum extends Model<Curriculum> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  @Field(() => ID)
  id: string;

  @BelongsToMany(() => School, () => SchoolCurriculum)
  @Field(() => [School], { nullable: 'itemsAndList' })
  schools?: School[];

  @BelongsToMany(() => Teacher, () => TeacherCurriculum)
  @Field(() => [Teacher], { nullable: 'itemsAndList' })
  teacheres?: Teacher[];

  @Unique
  @Column
  @Field({ nullable: true })
  enName?: string;

  @Unique
  @Column
  @Field({ nullable: true })
  arName?: string;

  @Column
  @Field({ nullable: true })
  enDescription?: string;

  @Column
  @Field({ nullable: true })
  arDescription?: string;
}
