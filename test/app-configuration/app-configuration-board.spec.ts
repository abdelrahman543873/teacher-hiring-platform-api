import { post } from '../request';
import { NOT_EXISTED_UUID } from '../constants';
import { rollbackDbForAppConfiguration } from './rollback-for-app-configuration';
import { generateAppConfigurationData } from './generate-app-configuration-data';
import { AppConfigurationPermissionsEnum } from 'src/security-group/security-group-permissions';
import { APP_CONFIGURATION_BOARD } from '../graphql/app-configuration';

describe('App configuration suite test', () => {
  afterEach(async () => {
    await rollbackDbForAppConfiguration();
  });

  it('error_if_wrong_permission', async () => {
    const { admin, appConfiguration } = await generateAppConfigurationData();

    const res = await post({
      query: APP_CONFIGURATION_BOARD,
      variables: { input: { appConfigurationId: appConfiguration.id } },
      token: admin.token
    });

    expect(res.body.data.response.code).toBe(600);
  });

  it('app_configuration_board_by_id_or_key', async () => {
    const { appConfiguration, admin } = await generateAppConfigurationData({
      overrideSecurityGroup: {
        permissions: [AppConfigurationPermissionsEnum.READ_APP_CONFIGURATION]
      }
    });

    const resNotExisted = await post({
      query: APP_CONFIGURATION_BOARD,
      variables: { input: { appConfigurationId: NOT_EXISTED_UUID } },
      token: admin.token
    });
    expect(resNotExisted.body.data.response.code).toBe(642);

    const resNotInput = await post({
      query: APP_CONFIGURATION_BOARD,
      variables: { input: {} },
      token: admin.token
    });
    expect(resNotInput.body.data.response.code).toBe(643);

    const resById = await post({
      query: APP_CONFIGURATION_BOARD,
      variables: { input: { appConfigurationId: appConfiguration.id } },
      token: admin.token
    });
    expect(resById.body.data.response.code).toBe(200);
    expect(resById.body.data.response.data.value).toBe(appConfiguration.value);

    const resByKey = await post({
      query: APP_CONFIGURATION_BOARD,
      variables: { input: { key: appConfiguration.key } },
      token: admin.token
    });
    expect(resById.body.data.response.code).toBe(200);
    expect(resByKey.body.data.response.data.value).toBe(appConfiguration.value);
    expect(resByKey.body.data.response.data.key).toBe(appConfiguration.key);
  });
});
