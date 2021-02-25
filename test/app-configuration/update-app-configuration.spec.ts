import { AppConfigurationFactory } from 'src/app-configuration/app-configuration.factory';
import { AppConfigurationPermissionsEnum } from 'src/security-group/security-group-permissions';
import { User } from 'src/user/models/user.model';
import { UserFactory } from 'src/user/user.factory';
import { NOT_EXISTED_UUID } from '../constants';
import { UPDATE_APP_CONFIGURATION } from '../graphql/app-configuration';
import { post } from '../request';
import { generateAppConfigurationData } from './generate-app-configuration-data';
import { rollbackDbForAppConfiguration } from './rollback-for-app-configuration';
import { AdminUserFactory } from '../../src/user/user.factory';

describe('Update app configuration suite case', () => {
  afterEach(async () => {
    await rollbackDbForAppConfiguration();
  });

  it('return_error_if_not_authorized', async () => {
    const { appConfiguration } = await generateAppConfigurationData();

    const res = await post({
      query: UPDATE_APP_CONFIGURATION,
      variables: {
        input: {
          appConfigurationId: appConfiguration.id,
          key: 'new'
        }
      }
    });
    expect(res.body.data.response.code).toBe(600);
  });

  it('error_if_not_admin', async () => {
    const { appConfiguration } = await generateAppConfigurationData();
    const user = await UserFactory({});

    const res = await post({
      query: UPDATE_APP_CONFIGURATION,
      variables: {
        input: {
          appConfigurationId: appConfiguration.id,
          key: 'new'
        }
      },
      token: (user as User).token
    });

    expect(res.body.data.response.code).toBe(600);
  });

  it('error_if_empty_update_data', async () => {
    const { appConfiguration, admin } = await generateAppConfigurationData({
      overrideSecurityGroup: {
        permissions: [AppConfigurationPermissionsEnum.UPDATE_APP_CONFIGURATION]
      }
    });
    const res = await post({
      query: UPDATE_APP_CONFIGURATION,
      variables: {
        input: {
          appConfigurationId: appConfiguration.id
        }
      },
      token: admin.token
    });
    expect(res.body.data.response.code).toBe(624);
  });

  it('error_if_wrong_permission', async () => {
    const { admin, appConfiguration } = await generateAppConfigurationData({
      overrideSecurityGroup: {
        permissions: [AppConfigurationPermissionsEnum.CREATE_APP_CONFIGURATION]
      }
    });
    const res = await post({
      query: UPDATE_APP_CONFIGURATION,
      variables: {
        input: {
          appConfigurationId: appConfiguration.id,
          key: 'new'
        }
      },
      token: admin.token
    });
    expect(res.body.data.response.code).toBe(600);
  });

  it('return_error_if_app_configuration_not_exist', async () => {
    const { admin } = await generateAppConfigurationData({
      overrideSecurityGroup: {
        permissions: [AppConfigurationPermissionsEnum.UPDATE_APP_CONFIGURATION]
      }
    });
    const res = await post({
      query: UPDATE_APP_CONFIGURATION,
      variables: {
        input: {
          appConfigurationId: NOT_EXISTED_UUID,
          key: 'key'
        }
      },
      token: admin.token
    });

    expect(res.body.data.response.code).toBe(642);
  });

  it('return_error_if_app_configuration_already_exist_with_same_key', async () => {
    const { appConfiguration, admin } = await generateAppConfigurationData({
      overrideSecurityGroup: {
        permissions: [AppConfigurationPermissionsEnum.UPDATE_APP_CONFIGURATION]
      }
    });
    const otherAppConfiguration = await AppConfigurationFactory();
    const res = await post({
      query: UPDATE_APP_CONFIGURATION,
      variables: {
        input: {
          appConfigurationId: appConfiguration.id,
          key: otherAppConfiguration.key
        }
      },
      token: admin.token
    });

    expect(res.body.data.response.code).toBe(612);
  });

  it('update_app_configuration', async () => {
    const { appConfiguration, admin } = await generateAppConfigurationData({
      overrideSecurityGroup: {
        permissions: [AppConfigurationPermissionsEnum.UPDATE_APP_CONFIGURATION]
      }
    });
    const res = await post({
      query: UPDATE_APP_CONFIGURATION,
      variables: {
        input: {
          appConfigurationId: appConfiguration.id,
          key: 'new key',
          value: 'value'
        }
      },
      token: admin.token
    });
    expect(res.body.data.response.code).toBe(200);
    expect(res.body.data.response.data.value).toEqual('value');
  });
});
