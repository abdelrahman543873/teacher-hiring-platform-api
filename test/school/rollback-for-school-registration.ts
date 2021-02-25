import { AppConfigurationRepository } from 'src/app-configuration/app-configuration.repository';
import { CurriculumRepository } from 'src/curriculum/curriculum.repository';
import { SchoolRepository } from 'src/school/school.repository';
import { UserVerificationCodeRepository } from 'src/user/repositories/user-verification-code.repository';
import { UserRepository } from 'src/user/repositories/user.repository';

export async function rollbackDbForSchoolRegistration() {
  const appConfigurationRepo = new AppConfigurationRepository();
  const userRepo = new UserRepository();
  const schoolRepo = new SchoolRepository();
  const userVerificationCodeRepo = new UserVerificationCodeRepository();

  await appConfigurationRepo.rawDelete();
  await userRepo.rawDelete();
  await schoolRepo.rawDelete();
  await userVerificationCodeRepo.rawDelete();
}

export async function rollbackDbForCompleteSchoolRegistration() {
  const appConfigurationRepo = new AppConfigurationRepository();
  const userRepo = new UserRepository();
  const schoolRepo = new SchoolRepository();
  const userVerificationCodeRepo = new UserVerificationCodeRepository();
  const curriculumRepo = new CurriculumRepository();

  await appConfigurationRepo.rawDelete();
  await userRepo.rawDelete();
  await schoolRepo.rawDelete();
  await userVerificationCodeRepo.rawDelete();
  await curriculumRepo.rawDelete();
}
