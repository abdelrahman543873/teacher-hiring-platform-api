import { SchoolFactory } from 'src/school/school.factory';
import { User } from 'src/user/models/user.model';
import { OtpFactory } from 'src/user/otp.factory';
import { UserVerificationCodeRepository } from 'src/user/repositories/user-verification-code.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import {
  GenderEnum,
  StatusEnum,
  UserRoleEnum,
  UserVerificationCodeUserCaseEnum
} from 'src/user/user.enum';
import { UserFactory } from 'src/user/user.factory';
import { LastLoginDetails } from 'src/user/user.type';
import { HelperService } from 'src/_common/utils/helper.service';
import { REGISTER_AS_SCHOOL_ADMIN } from '../graphql/school';
import { post } from '../request';
import { generateSchoolAdminRegistrationInput } from './generate-school-data';
import { rollbackDbForCompleteSchoolRegistration } from './rollback-for-school-registration';

describe('School registration suite test', () => {
  afterEach(async () => {
    await rollbackDbForCompleteSchoolRegistration();
  });

  it('error if school admin phone equals to school phone', async () => {
    const { admin, school } = generateSchoolAdminRegistrationInput({
      school: { phone: '+201011760189' },
      admin: { phone: '+201011760189' }
    });
    const res = await post({
      query: REGISTER_AS_SCHOOL_ADMIN,
      variables: {
        input: {
          admin,
          school
        }
      }
    });
    expect(res.body.data.response.code).toBe(615);
  });

  it('error if school name exists', async () => {
    await SchoolFactory({
      paramsOnly: false,
      obj: {
        name: 'test'
      }
    });
    const { admin, school } = generateSchoolAdminRegistrationInput({
      school: { name: 'test' }
    });
    const res = await post({
      query: REGISTER_AS_SCHOOL_ADMIN,
      variables: {
        input: {
          admin,
          school
        }
      }
    });
    expect(res.body.data.response.code).toBe(613);
  });

  it('error if school email exists with school model', async () => {
    await SchoolFactory({
      paramsOnly: false,
      obj: {
        email: 'test@test.com'
      }
    });
    const { admin, school } = generateSchoolAdminRegistrationInput({
      school: { email: 'test@test.com' }
    });
    const res = await post({
      query: REGISTER_AS_SCHOOL_ADMIN,
      variables: {
        input: {
          admin,
          school
        }
      }
    });
    expect(res.body.data.response.code).toBe(616);
  });

  it('error if school email exists with user model', async () => {
    await UserFactory({
      paramsOnly: false,
      obj: {
        email: 'test1@test.com'
      }
    });
    const { admin, school } = generateSchoolAdminRegistrationInput({
      school: { email: 'test1@test.com' }
    });
    const res = await post({
      query: REGISTER_AS_SCHOOL_ADMIN,
      variables: {
        input: {
          admin,
          school
        }
      }
    });
    expect(res.body.data.response.code).toBe(616);
  });

  it('error if school phone number already exists in user model on phone entry', async () => {
    await UserFactory({
      paramsOnly: false,
      obj: {
        phone: '+201011760180'
      }
    });
    const { admin, school } = generateSchoolAdminRegistrationInput({
      school: { phone: '+201011760180' }
    });
    const res = await post({
      query: REGISTER_AS_SCHOOL_ADMIN,
      variables: {
        input: {
          admin,
          school
        }
      }
    });
    expect(res.body.data.response.code).toBe(617);
  });

  it('error if school phone number already exists in school model', async () => {
    await SchoolFactory({
      paramsOnly: false,
      obj: {
        phone: '+201011760180'
      }
    });
    const { admin, school } = generateSchoolAdminRegistrationInput({
      school: { phone: '+201011760180' }
    });
    const res = await post({
      query: REGISTER_AS_SCHOOL_ADMIN,
      variables: {
        input: {
          admin,
          school
        }
      }
    });
    expect(res.body.data.response.code).toBe(617);
  });

  it('error if school admin phone number exist in user model', async () => {
    await UserFactory({
      paramsOnly: false,
      obj: {
        phone: '+201011760180'
      }
    });
    const { admin, school } = generateSchoolAdminRegistrationInput({
      admin: { phone: '+201011760180' }
    });
    const res = await post({
      query: REGISTER_AS_SCHOOL_ADMIN,
      variables: {
        input: {
          admin,
          school
        }
      }
    });
    expect(res.body.data.response.code).toBe(618);
  });

  it('error if school admin phone number exist in school model', async () => {
    await SchoolFactory({
      paramsOnly: false,
      obj: {
        phone: '+201011760180'
      }
    });
    const { admin, school } = generateSchoolAdminRegistrationInput({
      admin: { phone: '+201011760180' }
    });
    const res = await post({
      query: REGISTER_AS_SCHOOL_ADMIN,
      variables: {
        input: {
          admin,
          school
        }
      }
    });
    expect(res.body.data.response.code).toBe(618);
  });

  it('error if school phone number equal to unverified number that its otp code not expired', async () => {
    const user = await UserFactory({ obj: { unverifiedPhone: '+201011760180' } });
    const { code, expiryDate } = new HelperService().createVerificationCode();
    await OtpFactory({
      obj: {
        code,
        expiryDate,
        userId: (user as User).id,
        useCase: UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION
      }
    });
    const { admin, school } = generateSchoolAdminRegistrationInput({
      school: { phone: '+201011760180' }
    });
    const res = await post({
      query: REGISTER_AS_SCHOOL_ADMIN,
      variables: {
        input: {
          admin,
          school
        }
      }
    });
    expect(res.body.data.response.code).toBe(617);
  });

  it('error if school admin phone number equal to unverified number that its otp code not expired', async () => {
    const user = await UserFactory({ obj: { unverifiedPhone: '+201011760180' } });
    const { code, expiryDate } = new HelperService().createVerificationCode();
    await OtpFactory({
      obj: {
        code,
        expiryDate,
        userId: (user as User).id,
        useCase: UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION
      }
    });
    const { admin, school } = generateSchoolAdminRegistrationInput({
      admin: { phone: '+201011760180' }
    });
    const res = await post({
      query: REGISTER_AS_SCHOOL_ADMIN,
      variables: {
        input: {
          admin,
          school
        }
      }
    });
    expect(res.body.data.response.code).toBe(618);
  });
  it('success if school phone number equal to unverified number that its otp code expired', async () => {
    const user = await UserFactory({ obj: { unverifiedPhone: '+201011760180' } });
    const { code } = new HelperService().createVerificationCode();
    await OtpFactory({
      obj: {
        code,
        expiryDate: new Date(),
        userId: (user as User).id,
        useCase: UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION
      }
    });
    const { admin, school } = generateSchoolAdminRegistrationInput({
      school: { phone: '+201011760180' }
    });
    const res = await post({
      query: REGISTER_AS_SCHOOL_ADMIN,
      variables: {
        input: {
          admin,
          school
        }
      }
    });
    const userVerificationCodeRepository = await new UserVerificationCodeRepository();
    const removedOtpCode = await userVerificationCodeRepository.findUserVerificationCodeByFilter({
      where: { userId: (user as User).id }
    });
    const userRepository = new UserRepository();
    const updatedUser = await userRepository.findUserByFilter({ where: { id: (user as User).id } });
    expect(res.body.data.response.code).toBe(200);
    expect(updatedUser.unverifiedPhone).toBeFalsy();
    expect(removedOtpCode).toBeFalsy();
  });

  it('success if school admin phone number equal to unverified number that its otp code expired', async () => {
    const user = await UserFactory({ obj: { unverifiedPhone: '+201011760180' } });
    const { code } = new HelperService().createVerificationCode();
    await OtpFactory({
      obj: {
        code,
        expiryDate: new Date(),
        userId: (user as User).id,
        useCase: UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION
      }
    });
    const { admin, school } = generateSchoolAdminRegistrationInput({
      admin: { phone: '+201011760180' }
    });
    const res = await post({
      query: REGISTER_AS_SCHOOL_ADMIN,
      variables: {
        input: {
          admin,
          school
        }
      }
    });
    const userVerificationCodeRepository = await new UserVerificationCodeRepository();
    const removedOtpCode = await userVerificationCodeRepository.findUserVerificationCodeByFilter({
      where: { userId: (user as User).id }
    });
    const userRepository = new UserRepository();
    const updatedUser = await userRepository.findUserByFilter({ where: { id: (user as User).id } });
    expect(res.body.data.response.code).toBe(200);
    expect(updatedUser.unverifiedPhone).toBeFalsy();
    expect(removedOtpCode).toBeFalsy();
  });

  it('success_on_registering_as_school_admin', async () => {
    const { admin, school } = generateSchoolAdminRegistrationInput({});
    const res = await post({
      query: REGISTER_AS_SCHOOL_ADMIN,
      variables: {
        input: {
          admin,
          school
        }
      }
    });
    const {
      code,
      data: {
        id,
        role,
        token,
        slug,
        email,
        unverifiedPhone,
        phone,
        rejectionReasons,
        isEmailVerified,
        gender,
        birthDate,
        city,
        profilePicture,
        isBlocked,
        securityGroup,
        notificationManager,
        createdAt,
        updatedAt,
        lastLoginDetails,
        teacher,
        school: schoolRes,
        location,
        status
      }
    } = res.body.data.response;

    const {
      id: schoolId,
      schoolAdminId,
      name,
      phone: schoolPhone,
      landlineNumber,
      email: schoolEmail,
      schoolType,
      city: schoolCity,
      profilePicture: schoolProfilePic,
      grades,
      curriculums,
      gender: schoolGender,
      certificates,
      location: schoolLocation,
      createdAt: schoolCreatedAt,
      updatedAt: schoolUpdatedAt
    } = schoolRes;
    const userRepo = new UserRepository();
    const { fcmTokens } = await userRepo.findCurrentUserForContext(id);
    expect(code).toBe(200);
    expect(role).toBe(UserRoleEnum.SCHOOLADMIN);
    expect(token).toBeTruthy();
    expect(slug).toBeTruthy();
    expect(email).toBeFalsy();
    expect(unverifiedPhone).toBe(admin.phone);
    expect(phone).toBeFalsy();
    expect(rejectionReasons).toBeFalsy();
    expect(status).toBe(StatusEnum.PENDING);
    expect(isEmailVerified).toBeFalsy();
    expect(gender).toBe(GenderEnum.MALE);
    expect(birthDate).toBeFalsy();
    expect(location).toBeFalsy();
    expect(city).toBeFalsy();
    expect(profilePicture).toBe('/default/avatar.png');
    expect(isBlocked).toBeFalsy();
    expect(securityGroup).toBeFalsy();
    expect(notificationManager).toBeTruthy();
    expect(notificationManager.VIA_EMAIL).toBeTruthy();
    expect(notificationManager.VIA_PUSH).toBeTruthy();
    expect(createdAt).toBeTruthy();
    expect(updatedAt).toBeTruthy();
    expect(lastLoginDetails).toBeTruthy();
    expect((lastLoginDetails as LastLoginDetails).lastLoginDevice).toBe(admin.device);
    expect((lastLoginDetails as LastLoginDetails).lastLoginAt).toBeTruthy();
    expect(teacher).toBeFalsy();
    expect(schoolRes).toBeTruthy();
    expect(schoolId).toBeTruthy();
    expect(schoolAdminId).toBe(id);
    expect(name).toBe(school.name);
    expect(schoolPhone).toBe(school.phone);
    expect(landlineNumber).toBe(school.landlineNumber);
    expect(schoolEmail).toBe(school.email.toLocaleLowerCase());
    expect(schoolType).toBe(school.schoolType);
    expect(schoolCity).toBe(school.city);
    expect(schoolProfilePic).toBe('/default/avatar.png');
    expect(grades).toBeFalsy();
    expect(curriculums).toBeFalsy();
    expect(schoolGender).toBeFalsy();
    expect(certificates).toBeFalsy();
    expect(schoolLocation).toBeFalsy();
    expect(schoolCreatedAt).toBeTruthy();
    expect(schoolUpdatedAt).toBeTruthy();
    expect(fcmTokens).toBeTruthy();
    expect(fcmTokens[admin.device]).toBe(admin.fcmToken);
  });
});
