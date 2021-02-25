import { SchoolFactory } from 'src/school/school.factory';
import { UserVerificationCode } from 'src/user/models/user-verification-code.model';
import { User } from 'src/user/models/user.model';
import { OtpFactory } from 'src/user/otp.factory';
import { UserRoleEnum } from 'src/user/user.enum';
import { UserFactory } from 'src/user/user.factory';

export async function generateSchoolAdminData({ school = {}, admin = {} }) {
  const createdSchoolAdmin = (await UserFactory({
    obj: { ...admin, role: UserRoleEnum.SCHOOLADMIN },
    paramsOnly: false
  })) as User;
  const createdSchool = await SchoolFactory({
    obj: { ...school, schoolAdminId: createdSchoolAdmin.id }
  });
  return { admin: createdSchoolAdmin, school: createdSchool };
}

export async function generateUserWithVerificationCode({ user = {}, verificationCode = {} }) {
  const createdUser = (await UserFactory({
    obj: { ...user },
    paramsOnly: false
  })) as User;

  const createdOtp = (await OtpFactory({
    obj: {
      ...verificationCode,
      userId: createdUser.id
    },
    paramsOnly: false
  })) as UserVerificationCode;

  return { user: createdUser, verificationCode: createdOtp };
}
