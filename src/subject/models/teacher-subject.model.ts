import { Field, ObjectType } from '@nestjs/graphql';
import { Table, Model, ForeignKey, Column } from 'sequelize-typescript';
import { Teacher } from '../../teacher/models/teacher.model';
import { Subject } from './subject.model';

@Table
@ObjectType()
export class TeacherSubject extends Model<TeacherSubject> {
  @ForeignKey(() => Teacher)
  @Column
  @Field()
  teacherId: string;

  @ForeignKey(() => Subject)
  @Column
  @Field()
  subjectId: string;
}
