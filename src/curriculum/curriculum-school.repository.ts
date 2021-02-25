import { Injectable } from '@nestjs/common';
import { BulkCreateOptions, Transaction } from 'sequelize/types';
import { SchoolCurriculum } from './models/school-curriculum.model';

@Injectable()
export class CurriculumSchoolRepository {
  private readonly Model = SchoolCurriculum;

  async bulkCreate(models: {}[], options: BulkCreateOptions) {
    return await this.Model.bulkCreate(models, options);
  }

  async destroyForSchoolId(schoolId: string, transaction?: Transaction) {
    if (!schoolId) return;
    return this.Model.destroy({ where: { schoolId }, transaction });
  }
}
