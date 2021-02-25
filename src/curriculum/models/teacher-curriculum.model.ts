import { Field, ObjectType } from '@nestjs/graphql';
import { Table, Model, ForeignKey, Column } from 'sequelize-typescript';
import { Curriculum } from './curriculum.model';
import { Teacher } from '../../teacher/models/teacher.model';

@Table
@ObjectType()
export class TeacherCurriculum extends Model<TeacherCurriculum> {
  @ForeignKey(() => Teacher)
  @Column
  @Field()
  teacherId: string;

  @ForeignKey(() => Curriculum)
  @Column
  @Field()
  curriculumId: string;
}
