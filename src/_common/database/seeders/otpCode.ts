import { OtpsFactory } from 'src/user/otp.factory';
import { UserVerificationCodeRepository } from 'src/user/repositories/user-verification-code.repository';
import { UserRepository } from 'src/user/repositories/user.repository';

export const seed = async ({ count, truncate }) => {
  const userRepository = new UserRepository();
  const userVerificationCodeRepository = new UserVerificationCodeRepository();
  const foundUsersWithUnverifiedPhone = await userRepository.findUsersWithUnVerified();
  if (!foundUsersWithUnverifiedPhone?.length) {
    console.log('ERROR: Please seed users first');
    process.exit(1);
  }
  if (truncate) {
    await userVerificationCodeRepository.truncate();
  }
  // Seed users
  return [
    ...(await OtpsFactory(count - 1, {
      usersIds: foundUsersWithUnverifiedPhone.map(({ id }) => id)
    }))
  ];
};
