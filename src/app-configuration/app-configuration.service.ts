import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { HelperService } from 'src/_common/utils/helper.service';
import { AppConfigurationRepository } from './app-configuration.repository';
import { Injectable, Inject } from '@nestjs/common';
import { CreateAppConfigurationInput } from './inputs/create-app-configurations.input';
import { AppConfiguration } from 'src/app-configuration/app-configuration.model';
import { UpdateAppConfigurationInput } from './inputs/update-app-configuration.input';
import { Op } from 'sequelize';
import { CONTEXT } from '@nestjs/graphql';
import { AppConfigurationInput } from './inputs/app-configuration.input';
import { GqlContext } from 'src/_common/graphql/graphql-context.type';

@Injectable()
export class AppConfigurationService {
  constructor(
    private readonly appConfigurationRepo: AppConfigurationRepository,
    private readonly helperService: HelperService,
    @Inject(CONTEXT) private readonly context: GqlContext
  ) {}

  async localizedAppConfiguration(key: string) {
    const { lang } = this.context;
    try {
      const config = await this.appConfigurationRepo.findAppConfigurationByFilter({
        key: `${lang.toLowerCase()}${this.helperService.upperFirstWord(key)}`
      });
      return config ? config.value : null;
    } catch (error) {
      throw new BaseHttpException(lang, error.status || 500, error.message);
    }
  }
  async checkIfConfigurationExists(input: AppConfigurationInput) {
    try {
      const { lang } = this.context;
      if (!input.appConfigurationId && !input.key) throw new BaseHttpException(lang, 643);
      const appConfiguration = await this.appConfigurationRepo.findAppConfigurationByFilter({
        [Op.or]: [
          ...(input.key ? [{ key: input.key }] : []),
          ...(input.appConfigurationId ? [{ id: input.appConfigurationId }] : [])
        ]
      });
      if (!appConfiguration) {
        throw new BaseHttpException(lang, 642);
      }
      return appConfiguration;
    } catch (error) {
      throw new BaseHttpException('EN', error.status || 500, error.message);
    }
  }

  async appConfigurationsBoard() {
    const { lang } = this.context;
    try {
      const terms = await this.appConfigurationRepo.findAppConfigurationsByFilter();
      return terms;
    } catch (error) {
      throw new BaseHttpException(lang, error.status || 500, error.message);
    }
  }
  async createAppConfigurationBoard(input: CreateAppConfigurationInput): Promise<AppConfiguration> {
    try {
      await this.checkIfConfigurationHasUniqueKeyOrError(input.key);
      return await this.appConfigurationRepo.createAppConfiguration({ ...input });
    } catch (error) {
      throw new BaseHttpException('EN', error.status || 500, error.message);
    }
  }
  async checkIfConfigurationHasUniqueKeyOrError(key: string) {
    try {
      const { lang } = this.context;
      const appConfiguration = await this.appConfigurationRepo.findAppConfigurationByFilter({
        key: key
      });
      if (appConfiguration) throw new BaseHttpException(lang, 640);
    } catch (error) {
      throw new BaseHttpException('EN', error.status || 500, error.message);
    }
  }

  async updateAppConfigurationBoard(input: UpdateAppConfigurationInput): Promise<AppConfiguration> {
    try {
      if (!input.key && !input.value && !input.displayAs)
        throw new BaseHttpException(this.context.lang, 624);
      const { lang } = this.context;
      const appConfiguration = await this.appConfigurationRepo.findAppConfigurationByFilter({
        id: input.appConfigurationId
      });
      if (!appConfiguration) throw new BaseHttpException(lang, 642);
      if (input.key)
        await this.checkIfConfigurationHasSameKeyInAnotherInstance(
          input.key,
          input.appConfigurationId
        );
      return await this.appConfigurationRepo.updateAppConfigurationFromExistingModel(
        appConfiguration,
        { ...input }
      );
    } catch (error) {
      throw new BaseHttpException('EN', error.status || 500, error.message);
    }
  }

  async checkIfConfigurationHasSameKeyInAnotherInstance(key: string, appConfigurationId: string) {
    try {
      const { lang } = this.context;
      const appConfiguration = await this.appConfigurationRepo.findAppConfigurationByFilter({
        key: key,
        id: { [Op.ne]: appConfigurationId }
      });
      if (appConfiguration) throw new BaseHttpException(lang, 612);
    } catch (error) {
      throw new BaseHttpException('EN', error.status || 500, error.message);
    }
  }
}
