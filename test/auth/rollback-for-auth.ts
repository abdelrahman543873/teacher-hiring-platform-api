import { AppConfigurationRepository } from 'src/app-configuration/app-configuration.repository';
import { UserVerificationCodeRepository } from 'src/user/repositories/user-verification-code.repository';
import { UserRepository } from 'src/user/repositories/user.repository';

export async function rollbackDbForVerificationCode() {
  const appConfigurationRepo = new AppConfigurationRepository();
  const userRepo = new UserRepository();
  const userVerificationCodeRepo = new UserVerificationCodeRepository();

  await appConfigurationRepo.rawDelete();
  await userRepo.rawDelete();
  await userVerificationCodeRepo.rawDelete();
}
