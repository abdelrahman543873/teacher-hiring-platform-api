import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { groupBy } from 'ramda';
import { SchoolRepository } from './school.repository';

@Injectable()
export class SchoolDataLoader {
  constructor(private schoolRepo: SchoolRepository) {}
  schoolDataLoader = new DataLoader(async (schoolIDs: string[]) => {
    const schoolCurriculums = await this.schoolRepo.findSchoolsCurriculums(schoolIDs);
    const obj = groupBy(school => school.id, schoolCurriculums);
    return schoolIDs.map(id => obj[id][0]['curriculums']);
  });
}
