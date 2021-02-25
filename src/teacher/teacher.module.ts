import { Module } from '@nestjs/common';
import { TeacherRepository } from './teacher.repository';
import { TeacherResolver } from './teacher.resolver';
import { TeacherService } from './teacher.service';
import { TeacherSubjectDataLoader } from './teacher-subject.dataloader';
import { TeacherCurriculumDataLoader } from './teacher-curriculum.dataloader';
import { SubjectModule } from '../subject/subject.module';
import { CurriculumModule } from '../curriculum/curriculum.module';
import { HelperModule } from '../_common/utils/helper.module';
import { TeacherValidator } from './teacher.validator';
import { DatabaseModule } from '../_common/database/database.module';
import { UserModule } from '../user/user.module';
import { UploaderModule } from 'src/_common/uploader/uploader.module';
import { TeacherTransformer } from './teacher.transformer';

@Module({
  imports: [
    SubjectModule,
    UploaderModule,
    CurriculumModule,
    HelperModule,
    DatabaseModule,
    UserModule
  ],
  providers: [
    TeacherResolver,
    TeacherRepository,
    TeacherService,
    TeacherSubjectDataLoader,
    TeacherCurriculumDataLoader,
    TeacherValidator,
    TeacherTransformer
  ]
})
export class TeacherModule {}
