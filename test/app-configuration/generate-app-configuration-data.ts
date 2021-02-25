import {
  AppConfigurationFactory,
  AppConfigurationType
} from 'src/app-configuration/app-configuration.factory';
import { AppConfiguration } from 'src/app-configuration/app-configuration.model';
import { AppConfigurationPermissionsEnum } from 'src/security-group/security-group-permissions';
import { SecurityGroupFactory } from 'src/security-group/security-group.factory';
import { User } from 'src/user/models/user.model';
import { UserFactory } from 'src/user/user.factory';
import { SUPER_ADMIN_GROUP } from '../constants';

interface AppConfigurationGenerateData {
  overrideInput?: Record<string, any>;
  overrideSecurityGroup?: Record<string, any>;
  admin?: User;
  overrideAppConfiguration?: Record<string, any>;
}
export async function generateAppConfigurationData(
  overrideData: AppConfigurationGenerateData = {}
) {
  const adminRole = await SecurityGroupFactory({
    obj: {
      groupName: SUPER_ADMIN_GROUP,
      permissions: [AppConfigurationPermissionsEnum.CREATE_APP_CONFIGURATION],
      ...(overrideData.overrideSecurityGroup || {})
    }
  });

  const admin =
    overrideData.admin ||
    ((await UserFactory({ obj: { securityGroupId: adminRole.id }, paramsOnly: false })) as User);

  const input = (await AppConfigurationFactory(true, {
    ...(overrideData.overrideInput || {})
  })) as AppConfigurationType & { appConfigurationId?: string };

  const appConfiguration = (await AppConfigurationFactory(false, {
    ...(overrideData.overrideAppConfiguration || {})
  })) as AppConfiguration;

  return { input, appConfiguration, adminRole, admin };
}
