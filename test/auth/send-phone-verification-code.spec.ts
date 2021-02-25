import { SchoolFactory } from 'src/school/school.factory';
import { UserVerificationCode } from 'src/user/models/user-verification-code.model';
import { User } from 'src/user/models/user.model';
import { OtpFactory } from 'src/user/otp.factory';
import { UserVerificationCodeRepository } from 'src/user/repositories/user-verification-code.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import { StatusEnum, UserVerificationCodeUserCaseEnum } from 'src/user/user.enum';
import { UserFactory } from 'src/user/user.factory';
import { HelperService } from 'src/_common/utils/helper.service';
import { SEND_VERIFICATION_CODE } from '../graphql/auth';
import { post } from '../request';
import { rollbackDbForVerificationCode } from './rollback-for-auth';
describe('Send_Phone_verification_code_suite_case', () => {
  afterEach(async () => {
    await rollbackDbForVerificationCode();
  });
  it('returns_error_if_status_is_rejected', async () => {
    const user = (await UserFactory({ obj: { status: StatusEnum.REJECTED } })) as User;
    const res = await post({
      query: SEND_VERIFICATION_CODE,
      token: user.token,
      variables: {}
    });
    expect(res.body.data.response.code).toBe(623);
  });

  it('returns_error_if_he_not_provided_updated_phone_and_he_not_have_phone_and_un_verified_phone', async () => {
    const user = (await UserFactory({
      obj: { status: StatusEnum.PENDING, phone: null, unverifiedPhone: null }
    })) as User;
    const res = await post({
      query: SEND_VERIFICATION_CODE,
      token: user.token,
      variables: {}
    });
    expect(res.body.data.response.code).toBe(620);
  });

  it('returns_error_if_he_provided__updated_phone_equal_to_his_verified_phone', async () => {
    const user = (await UserFactory({
      obj: { status: StatusEnum.PENDING, unverifiedPhone: null }
    })) as User;

    const res = await post({
      query: SEND_VERIFICATION_CODE,
      token: user.token,
      variables: {
        updatedPhone: user.phone
      }
    });
    expect(res.body.data.response.code).toBe(619);
  });

  it('returns_error_if_he_provided_updated_phone_that_exists_in_school_model', async () => {
    const user = (await UserFactory({
      obj: { status: StatusEnum.PENDING, unverifiedPhone: null }
    })) as User;
    const school = await SchoolFactory({
      obj: {
        phone: '+201011760180'
      }
    });
    const res = await post({
      query: SEND_VERIFICATION_CODE,
      token: user.token,
      variables: {
        updatedPhone: school.phone
      }
    });
    expect(res.body.data.response.code).toBe(618);
  });

  it('returns_error_if_he_provided_updated_phone_that_exists_in_user_model', async () => {
    const user = (await UserFactory({
      obj: { status: StatusEnum.PENDING, unverifiedPhone: null }
    })) as User;

    const otherUser = (await UserFactory({
      obj: { status: StatusEnum.PENDING, unverifiedPhone: null }
    })) as User;

    const res = await post({
      query: SEND_VERIFICATION_CODE,
      token: user.token,
      variables: {
        updatedPhone: otherUser.phone
      }
    });
    expect(res.body.data.response.code).toBe(618);
  });

  it('returns_error_if_he_provided_updated_phone_that_is_unverified_for_other_user_but_otp_not_expired_yet', async () => {
    const user = (await UserFactory({
      obj: { status: StatusEnum.PENDING, unverifiedPhone: null }
    })) as User;

    const otherUser = (await UserFactory({
      obj: { status: StatusEnum.PENDING }
    })) as User;

    const { code, expiryDate } = new HelperService().createVerificationCode();
    await OtpFactory({
      obj: {
        code,
        expiryDate,
        userId: otherUser.id,
        useCase: UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION
      },
      paramsOnly: false
    });

    const res = await post({
      query: SEND_VERIFICATION_CODE,
      token: user.token,
      variables: {
        updatedPhone: otherUser.unverifiedPhone
      }
    });
    expect(res.body.data.response.code).toBe(618);
  });

  it('returns_error_if_he_not_provided_updated_phone_and_he_did_not_have_unverified_phone_number', async () => {
    const user = (await UserFactory({
      obj: { status: StatusEnum.PENDING, unverifiedPhone: null }
    })) as User;

    const res = await post({
      query: SEND_VERIFICATION_CODE,
      token: user.token,
      variables: {}
    });
    expect(res.body.data.response.code).toBe(619);
  });

  it('returns_success_if_he_provided_updated_phone_that_is_unverified_for_other_user_but_otp_expired', async () => {
    const user = (await UserFactory({
      obj: { status: StatusEnum.PENDING, unverifiedPhone: null }
    })) as User;

    const otherUser = (await UserFactory({
      obj: { status: StatusEnum.PENDING }
    })) as User;

    const { code } = new HelperService().createVerificationCode();
    await OtpFactory({
      obj: {
        code,
        expiryDate: new Date(),
        userId: otherUser.id,
        useCase: UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION
      },
      paramsOnly: false
    });

    const res = await post({
      query: SEND_VERIFICATION_CODE,
      token: user.token,
      variables: {
        updatedPhone: otherUser.unverifiedPhone
      }
    });
    const userRepository = new UserRepository();
    const userVerificationCodeRepository = new UserVerificationCodeRepository();
    const updatedOtherUser = await userRepository.findUserByFilter({
      where: {
        id: otherUser.id
      }
    });
    const deletedUserVerificationCode = await userVerificationCodeRepository.findUserVerificationCodeByFilter(
      {
        where: {
          userId: otherUser.id,
          useCase: UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION
        }
      }
    );
    const createdUserVerificationCode = await userVerificationCodeRepository.findUserVerificationCodeByFilter(
      {
        where: {
          userId: user.id,
          useCase: UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION
        }
      }
    );
    expect(res.body.data.response.code).toBe(200);
    expect(updatedOtherUser.unverifiedPhone).toBeFalsy();
    expect(deletedUserVerificationCode).toBeFalsy();
    expect(createdUserVerificationCode).toBeTruthy();
    expect(res.body.data.response.data.unverifiedPhone).toBe(otherUser.unverifiedPhone);
  });

  it('returns_success_if_he_not_provided_updated_phone_but_still_have_unverified_phone_number_but_otp_expired', async () => {
    const user = (await UserFactory({
      obj: { status: StatusEnum.PENDING }
    })) as User;

    const { code } = new HelperService().createVerificationCode();
    const expiredOtp = (await OtpFactory({
      obj: {
        code,
        expiryDate: new Date(),
        userId: user.id,
        useCase: UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION
      },
      paramsOnly: false
    })) as UserVerificationCode;

    const res = await post({
      query: SEND_VERIFICATION_CODE,
      token: user.token,
      variables: {}
    });

    const userVerificationCodeRepository = new UserVerificationCodeRepository();

    const createdUserVerificationCode = await userVerificationCodeRepository.findUserVerificationCodeByFilter(
      {
        where: {
          userId: user.id,
          useCase: UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION
        }
      }
    );
    console.log(res.body);
    expect(res.body.data.response.code).toBe(200);
    expect(createdUserVerificationCode).toBeTruthy();
    expect(res.body.data.response.data.unverifiedPhone).toBe(user.unverifiedPhone);
    expect(createdUserVerificationCode.expiryDate.getTime()).toBeGreaterThan(
      expiredOtp.expiryDate.getTime()
    );
  });

  it('returns_success_if_he_not_provided_updated_phone_but_still_have_unverified_phone_number_but_otp_not_expired', async () => {
    const user = (await UserFactory({
      obj: { status: StatusEnum.PENDING }
    })) as User;

    const { code, expiryDate } = new HelperService().createVerificationCode();
    const expiredOtp = (await OtpFactory({
      obj: {
        code,
        expiryDate,
        userId: user.id,
        useCase: UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION
      },
      paramsOnly: false
    })) as UserVerificationCode;

    const res = await post({
      query: SEND_VERIFICATION_CODE,
      token: user.token,
      variables: {}
    });

    const userVerificationCodeRepository = new UserVerificationCodeRepository();

    const createdUserVerificationCode = await userVerificationCodeRepository.findUserVerificationCodeByFilter(
      {
        where: {
          userId: user.id,
          useCase: UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION
        }
      }
    );
    expect(res.body.data.response.code).toBe(200);
    expect(createdUserVerificationCode).toBeTruthy();
    expect(res.body.data.response.data.unverifiedPhone).toBe(user.unverifiedPhone);
    expect(createdUserVerificationCode.expiryDate.getTime()).toBeGreaterThan(
      expiredOtp.expiryDate.getTime()
    );
  });
});
