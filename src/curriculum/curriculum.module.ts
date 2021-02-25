import { Module } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { CurriculumResolver } from './curriculum.resolver';
import { CurriculumRepository } from './curriculum.repository';
import { CurriculumSchoolRepository } from './curriculum-school.repository';
import { CurriculumValidator } from './curriculum.validator';

@Module({
  providers: [
    CurriculumService,
    CurriculumResolver,
    CurriculumRepository,
    CurriculumSchoolRepository,
    CurriculumValidator,
    CurriculumValidator
  ],
  exports: [CurriculumRepository, CurriculumSchoolRepository, CurriculumValidator]
})
export class CurriculumModule {}
