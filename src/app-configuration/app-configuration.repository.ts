import { Injectable } from '@nestjs/common';
import { Includeable, Transaction, WhereOptions } from 'sequelize';
import { AppConfiguration } from './app-configuration.model';

@Injectable()
export class AppConfigurationRepository {
  async findAppConfigurationByFilter(where: WhereOptions = {}, include: Includeable[] = []) {
    return await AppConfiguration.findOne({ where, include });
  }

  async findAppConfigurationsByFilter(where: WhereOptions = {}, include: Includeable[] = []) {
    return await AppConfiguration.findAll({ where, include });
  }

  async createAppConfiguration(input = {}, include: Includeable[] = [], transaction?: Transaction) {
    return await AppConfiguration.create(input, { include, ...(transaction && { transaction }) });
  }

  async createAppConfigurations(models: {}[]) {
    return await AppConfiguration.bulkCreate(models);
  }

  async updateAppConfigurationFromExistingModel(
    appConfiguration: AppConfiguration,
    input = {},
    transaction?: Transaction
  ) {
    await appConfiguration.update(input, { ...(transaction && { transaction }) });
    return appConfiguration;
  }

  async deleteAppConfiguration(appConfigurationId: string) {
    return await AppConfiguration.destroy({ where: { id: appConfigurationId } });
  }

  async truncateAppConfigurationModel() {
    return await AppConfiguration.truncate({ force: true, cascade: true });
  }

  async rawDelete() {
    await AppConfiguration.sequelize.query(`delete from "AppConfigurations"`);
  }
}
