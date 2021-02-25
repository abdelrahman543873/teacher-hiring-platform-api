import { UserRepository } from '../../src/user/repositories/user.repository';
import { SecurityGroupRepository } from '../../src/security-group/security-group.repository';

export async function rollbackDbForLogin() {
  const userRepo = new UserRepository();
  const securityGroupRepo = new SecurityGroupRepository();

  await userRepo.rawDelete();
  await securityGroupRepo.rawDelete();
}
