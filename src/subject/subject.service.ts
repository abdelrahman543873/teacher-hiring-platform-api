import { Injectable } from '@nestjs/common';
import { SubjectRepository } from './subject.repository';
import { SubjectInput } from './input/subject.input';
import { BaseHttpException } from '../_common/exceptions/base-http-exception';
import { UpdateSubjectInput } from './input/update-subject.input';

@Injectable()
export class SubjectService {
  constructor(private readonly subjectRepo: SubjectRepository) {}
  async findSbuject(id: string) {
    return await this.subjectRepo.findSubject(id);
  }
  async subjects() {
    return await this.subjectRepo.subjects();
  }
  async createSubject(subject: SubjectInput) {
    const subjectQuery = await this.subjectRepo.findSubjectByArNameOrEnName(subject);
    if (subjectQuery) throw new BaseHttpException('EN', 648);
    return await this.subjectRepo.createSubject(subject);
  }
  async updateSubject(input: UpdateSubjectInput) {
    const subject = await this.subjectRepo.findSubject(input.id);
    if (!subject) throw new BaseHttpException('EN', 645);
    return await this.subjectRepo.updateExistingSubject(input);
  }
  async deleteSubject(id: string) {
    return await this.subjectRepo.deleteSubject(id);
  }
}
