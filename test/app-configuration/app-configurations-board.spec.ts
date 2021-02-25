import { AppConfigurationsFactory } from 'src/app-configuration/app-configuration.factory';
import { AppConfigurationPermissionsEnum } from 'src/security-group/security-group-permissions';
import { APP_CONFIGURATIONS_BOARD } from '../graphql/app-configuration';
import { post } from '../request';
import { generateAppConfigurationData } from './generate-app-configuration-data';
import { rollbackDbForAppConfiguration } from './rollback-for-app-configuration';

describe('App configurations suite test', () => {
  afterEach(async () => {
    await rollbackDbForAppConfiguration();
  });

  it('error_if_error_permission', async () => {
    await AppConfigurationsFactory(10);
    const { admin } = await generateAppConfigurationData({
      overrideSecurityGroup: {
        permissions: [AppConfigurationPermissionsEnum.CREATE_APP_CONFIGURATION]
      }
    });
    const res = await post({ query: APP_CONFIGURATIONS_BOARD, token: admin.token });

    expect(res.body.data.response.code).toBe(600);
  });

  it('app_configurations', async () => {
    await AppConfigurationsFactory(10);
    const { admin } = await generateAppConfigurationData({
      overrideSecurityGroup: {
        permissions: [AppConfigurationPermissionsEnum.READ_APP_CONFIGURATION]
      }
    });
    const res = await post({ query: APP_CONFIGURATIONS_BOARD, token: admin.token });

    expect(res.body.data.response.code).toBe(200);
    expect(res.body.data.response.data.length).toBe(11);
  });
});
