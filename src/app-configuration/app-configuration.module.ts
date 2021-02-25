import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/_common/database/database.module';
import { HelperModule } from 'src/_common/utils/helper.module';
import { AppConfigurationRepository } from './app-configuration.repository';
import { AppConfigurationResolver } from './app-configuration.resolver';
import { AppConfigurationService } from './app-configuration.service';

@Module({
  imports: [DatabaseModule, HelperModule],
  providers: [AppConfigurationService, AppConfigurationResolver, AppConfigurationRepository],
  exports: [AppConfigurationService, AppConfigurationRepository]
})
export class AppConfigurationModule {}
