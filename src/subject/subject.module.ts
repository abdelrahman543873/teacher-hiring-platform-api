import { Module } from '@nestjs/common';
import { SubjectRepository } from './subject.repository';
import { SubjectService } from './subject.service';
import { SubjectResolver } from './subject.resolver';
import { SubjectValidator } from './subject.validator';

@Module({
  providers: [SubjectRepository, SubjectService, SubjectResolver, SubjectValidator],
  exports: [SubjectRepository, SubjectValidator]
})
export class SubjectModule {}
