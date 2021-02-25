import * as faker from 'faker';
import { getValuesFromEnum } from 'src/_common/utils/columnEnum';
import { UserVerificationCode } from './models/user-verification-code.model';
import { UserVerificationCodeRepository } from './repositories/user-verification-code.repository';
import { UserVerificationCodeUserCaseEnum } from './user.enum';

const userVerificationCodeRepository = new UserVerificationCodeRepository();

type OtpType = {
  useCase: UserVerificationCodeUserCaseEnum;
  code: string;
  expiryDate: Date;
  userId: string;
};

function buildParams(obj: Record<string, any> = {}): OtpType {
  return {
    userId: obj.userId || faker.random.arrayElement(obj.usersIds),
    expiryDate: obj.expiryDate || faker.date.past(0, new Date()),
    code: obj.code || faker.random.number({ min: 1000, max: 9999 }),
    useCase:
      obj.useCase || faker.random.arrayElement(getValuesFromEnum(UserVerificationCodeUserCaseEnum))
  };
}

export async function OtpsFactory(count = 10, obj: Record<string, any> = { usersIds: [] }) {
  const otps = [];
  for (let i = 0; i < count; i++) {
    const otp = buildParams(obj);
    otps.push(otp);
  }
  return await userVerificationCodeRepository.bulkCreate(otps);
}

export async function OtpFactory({
  paramsOnly = false,
  obj = <Record<string, any>>{}
}): Promise<UserVerificationCode | OtpType> {
  const params = buildParams(obj);
  if (paramsOnly) return params;
  return await userVerificationCodeRepository.createOrUpdate({}, params);
}
