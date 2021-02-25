import { Injectable } from '@nestjs/common';
import { BaseHttpException } from '../_common/exceptions/base-http-exception';
import { SubjectRepository } from '../subject/subject.repository';
import { GetTeachersInput } from './inputs/teachers.input';
import { CurriculumValidator } from 'src/curriculum/curriculum.validator';
import { SubjectValidator } from 'src/subject/subject.validator';

@Injectable()
export class TeacherValidator {
  constructor(
    private readonly curriculumValidator: CurriculumValidator,
    private readonly subjectValidator: SubjectValidator
  ) {}

  async validateGetTeacherInput(input: GetTeachersInput): Promise<void> {
    if (input?.filterBy?.curriculums) {
      await this.curriculumValidator.validateCurriculumCount(input.filterBy.curriculums);
    }
    if (input?.filterBy?.subjects) {
      await this.subjectValidator.validateSubjectCount(input.filterBy.subjects);
    }
  }
}
