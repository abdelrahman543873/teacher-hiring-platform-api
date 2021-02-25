import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

import { DatabaseModule } from 'src/_common/database/database.module';
import { HelperModule } from 'src/_common/utils/helper.module';
import { SchoolRepository } from './school.repository';
import { SchoolResolver } from './school.resolver';
import { SchoolService } from './school.service';
import { SchoolTransformer } from './school.transformer';
import { SchoolValidator } from './school.validator';
import { SchoolDataLoader } from './school.dataloader';
import { UploaderModule } from 'src/_common/uploader/uploader.module';
import { CurriculumModule } from 'src/curriculum/curriculum.module';

@Module({
  imports: [UserModule, HelperModule, DatabaseModule, AuthModule, UploaderModule, CurriculumModule],
  providers: [
    SchoolRepository,
    SchoolResolver,
    SchoolService,
    SchoolValidator,
    SchoolTransformer,
    SchoolDataLoader
  ],
  exports: []
})
export class SchoolModule {}
