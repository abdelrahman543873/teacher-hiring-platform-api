import { Injectable } from '@nestjs/common';
import { CurriculumInput } from './inputs/curriculum.input';
import { CurriculumRepository } from './curriculum.repository';
import { Curriculum } from './models/curriculum.model';
import { BaseHttpException } from '../_common/exceptions/base-http-exception';
import { UpdateCurriculumInput } from './inputs/update-curriculum.input';

@Injectable()
export class CurriculumService {
  constructor(private readonly curriculumRepo: CurriculumRepository) {}

  async findCurriculum(id: string): Promise<Curriculum> {
    const curriculum = await this.curriculumRepo.findCurriculumByID(id);
    if (!curriculum) throw new BaseHttpException('EN', 646);
    return curriculum;
  }

  async Curriculums(): Promise<Curriculum[]> {
    return await this.curriculumRepo.Curriculums();
  }

  async createCurriculum(curriculum: CurriculumInput) {
    const existingCurriculum = await this.curriculumRepo.findCurriculumbyArNameEnName(curriculum);
    if (existingCurriculum) throw new BaseHttpException('EN', 640);
    return await this.curriculumRepo.createCurriculum(curriculum);
  }

  async updateCurriculum(curriculum: UpdateCurriculumInput) {
    const queriedCurriculum = await this.curriculumRepo.findCurriculumByID(curriculum.id);
    if (!queriedCurriculum) throw new BaseHttpException('EN', 646);
    return await this.curriculumRepo.updateCurriculum(curriculum);
  }

  async deleteCurriculum(id: string) {
    const curriculum = await this.curriculumRepo.findCurriculumByID(id);
    if (!curriculum || !id) throw new BaseHttpException('EN', 643);
    return await this.curriculumRepo.deleteCurriculum(id);
  }
}
