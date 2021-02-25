import { AppConfigurationRepository } from 'src/app-configuration/app-configuration.repository';
import { SecurityGroupRepository } from 'src/security-group/security-group.repository';
import { UserRepository } from 'src/user/repositories/user.repository';

export async function rollbackDbForAppConfiguration() {
  const securityGroupRepo = new SecurityGroupRepository();
  const appConfigurationRepo = new AppConfigurationRepository();
  const userRepo = new UserRepository();

  await securityGroupRepo.rawDelete();
  await appConfigurationRepo.rawDelete();
  await userRepo.rawDelete();
}
