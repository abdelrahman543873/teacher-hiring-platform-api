import { Field, ObjectType } from '@nestjs/graphql';
import { Table, Model, ForeignKey, Column } from 'sequelize-typescript';
import { School } from '../../school/models/school.model';
import { Curriculum } from './curriculum.model';

@Table
@ObjectType()
export class SchoolCurriculum extends Model<SchoolCurriculum> {
  @ForeignKey(() => School)
  @Column
  @Field()
  schoolId: string;

  @ForeignKey(() => Curriculum)
  @Column
  @Field()
  curriculumId: string;
}
