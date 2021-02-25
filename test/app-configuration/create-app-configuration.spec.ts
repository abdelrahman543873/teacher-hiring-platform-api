import { AppConfigurationFactory } from 'src/app-configuration/app-configuration.factory';
import { AppConfigurationPermissionsEnum } from 'src/security-group/security-group-permissions';
import { CREATE_APP_CONFIGURATION } from '../graphql/app-configuration';
import { post } from '../request';
import { generateAppConfigurationData } from './generate-app-configuration-data';
import { rollbackDbForAppConfiguration } from './rollback-for-app-configuration';

describe('Create app configuration suite case', () => {
  afterEach(async () => {
    await rollbackDbForAppConfiguration();
  });

  it('error_if_wrong_permission', async () => {
    const { input, admin } = await generateAppConfigurationData({
      overrideSecurityGroup: {
        permissions: [AppConfigurationPermissionsEnum.UPDATE_APP_CONFIGURATION]
      }
    });
    const res = await post({
      query: CREATE_APP_CONFIGURATION,
      variables: { input },
      token: admin.token
    });
    expect(res.body.data.response.code).toBe(600);
  });

  it('app_configuration_key_should_not_be_duplicated', async () => {
    const appConfiguration = await AppConfigurationFactory();
    const { input, admin } = await generateAppConfigurationData({
      overrideInput: { key: appConfiguration.key }
    });
    const res1 = await post({
      query: CREATE_APP_CONFIGURATION,
      variables: { input },
      token: admin.token
    });
    expect(res1.body.data.response.code).toBe(640);

    input.key = 'new key';
    const res2 = await post({
      query: CREATE_APP_CONFIGURATION,
      variables: { input },
      token: admin.token
    });

    expect(res2.body.data.response.code).toBe(200);
    expect(res2.body.data.response.data.value).toEqual(input.value);
  });
});
