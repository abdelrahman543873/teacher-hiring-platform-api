import {
  AppConfigurationFactory,
  AppConfigurationType
} from 'src/app-configuration/app-configuration.factory';
import { AppConfigurationPermissionsEnum } from 'src/security-group/security-group-permissions';
import { SecurityGroupFactory } from 'src/security-group/security-group.factory';
import { User } from 'src/user/models/user.model';
import { UserFactory } from 'src/user/user.factory';
import { SUPER_ADMIN_GROUP } from 'test/constants';

export async function generateSubjectData() {
  const adminRole = await SecurityGroupFactory({
    obj: {
      groupName: SUPER_ADMIN_GROUP,
      permissions: [AppConfigurationPermissionsEnum.CREATE_APP_CONFIGURATION]
    }
  });

  const admin = (await UserFactory({
    obj: { securityGroupId: adminRole.id },
    paramsOnly: false
  })) as User;

  const input = (await AppConfigurationFactory(true, {})) as AppConfigurationType & {
    appConfigurationId?: string;
  };

  return { input, adminRole, admin };
}
