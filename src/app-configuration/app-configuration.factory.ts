import * as faker from 'faker';
import { AppConfiguration } from './app-configuration.model';
import { AppConfigurationRepository } from './app-configuration.repository';

const appConfigurationRepo = new AppConfigurationRepository();

export type AppConfigurationType = {
  id?: string;
  key?: string;
  value: string;
  displayAs: string;
};

function buildParams(input = <any>{}, returnInputOnly: boolean): AppConfigurationType {
  return {
    key: input.key || faker.name.title(),
    value: input.value || faker.name.title(),
    displayAs: input.displayAs || faker.name.title()
  };
}

export const AppConfigurationFactory = async (
  returnInputOnly: boolean = false,
  input = <any>{}
): Promise<AppConfiguration | AppConfigurationType> => {
  const params = buildParams(input, returnInputOnly);
  if (returnInputOnly) return params;
  return await appConfigurationRepo.createAppConfiguration(params);
};

export const AppConfigurationsFactory = async (
  count: number = 10,
  input = <any>{}
): Promise<AppConfigurationType[]> => {
  let appConfigurations = [];
  for (let i = 0; i < count; i++) appConfigurations.push(buildParams(input, false));
  return await appConfigurationRepo.createAppConfigurations(appConfigurations);
};
