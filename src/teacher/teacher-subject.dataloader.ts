import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { groupBy } from 'ramda';
import { TeacherRepository } from './teacher.repository';

@Injectable()
export class TeacherSubjectDataLoader {
  constructor(private teacherRepo: TeacherRepository) {}
  subjectDataLoader = new DataLoader(async (teacherIDs: string[]) => {
    const teacherSubjects = await this.teacherRepo.findTeacherSubjects(teacherIDs);
    const obj = groupBy(teacher => teacher.teacherId, teacherSubjects);
    return teacherIDs.map(id => obj[id][0]['subjects']);
  });
}
