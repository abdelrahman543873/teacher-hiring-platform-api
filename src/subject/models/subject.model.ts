import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Table,
  Model,
  BelongsToMany,
  Column,
  DataType,
  Default,
  PrimaryKey,
  Unique
} from 'sequelize-typescript';
import { Teacher } from '../../teacher/models/teacher.model';
import { TeacherSubject } from './teacher-subject.model';

@Table
@ObjectType()
export class Subject extends Model<Subject> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  @Field(() => ID)
  id: string;

  @BelongsToMany(() => Teacher, () => TeacherSubject)
  @Field(() => [Teacher], { nullable: 'itemsAndList' })
  teachers?: Teacher[];

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
