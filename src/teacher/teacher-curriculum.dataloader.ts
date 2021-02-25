import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { groupBy } from 'ramda';
import { TeacherRepository } from './teacher.repository';

@Injectable()
export class TeacherCurriculumDataLoader {
  constructor(private teacherRepo: TeacherRepository) {}
  curriculumDataLoader = new DataLoader(async (teacherIDs: string[]) => {
    const teacherCurriculums = await this.teacherRepo.findTeacherCurriculums(teacherIDs);
    const obj = groupBy(teacher => teacher.teacherId, teacherCurriculums);
    return teacherIDs.map(id => obj[id][0]['curriculums']);
  });
}
