import { UserVerificationCodeRepository } from 'src/user/repositories/user-verification-code.repository';
import { StatusEnum, UserVerificationCodeUserCaseEnum } from 'src/user/user.enum';
import { HelperService } from 'src/_common/utils/helper.service';
import { VERIFY_PHONE_VERIFICATION_CODE } from '../graphql/auth';
import { post } from '../request';
import { generateUserWithVerificationCode } from './generate-auth-data';
import { rollbackDbForVerificationCode } from './rollback-for-auth';

describe('verify_verification_code_suite_case', () => {
  afterEach(async () => {
    await rollbackDbForVerificationCode();
  });
  it('returns_error_if_status_is_rejected_in_phone_verification', async () => {
    const { user, verificationCode } = await generateUserWithVerificationCode({
      user: { status: StatusEnum.REJECTED }
    });
    const res = await post({
      query: VERIFY_PHONE_VERIFICATION_CODE,
      token: user.token,
      variables: {
        code: verificationCode.code
      }
    });
    expect(res.body.data.response.code).toBe(623);
  });

  it('returns_error_if_user_did_not_have_unverified_phone_number_in_phone_verification', async () => {
    const { user, verificationCode } = await generateUserWithVerificationCode({
      user: { status: StatusEnum.PENDING, unverifiedPhone: null }
    });
    const res = await post({
      query: VERIFY_PHONE_VERIFICATION_CODE,
      token: user.token,
      variables: {
        code: verificationCode.code
      }
    });
    expect(res.body.data.response.code).toBe(620);
  });

  it('returns_error_if_user_did_not_have_unverified_phone_number_and_phone_in_phone_verification', async () => {
    const { user, verificationCode } = await generateUserWithVerificationCode({
      user: { status: StatusEnum.PENDING, phone: null, unverifiedPhone: null }
    });
    const res = await post({
      query: VERIFY_PHONE_VERIFICATION_CODE,
      token: user.token,
      variables: {
        code: verificationCode.code
      }
    });
    expect(res.body.data.response.code).toBe(620);
  });

  it('returns_error_if_user_have_unverified_phone_with_expired_otp_in_phone_verification', async () => {
    const { user, verificationCode } = await generateUserWithVerificationCode({
      user: { status: StatusEnum.PENDING },
      verificationCode: {
        expiryDate: new Date(),
        useCase: UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION
      }
    });
    const res = await post({
      query: VERIFY_PHONE_VERIFICATION_CODE,
      token: user.token,
      variables: {
        code: verificationCode.code
      }
    });
    expect(res.body.data.response.code).toBe(625);
  });

  it('returns_error_if_user_did_not_have_otp_in_phone_verification', async () => {
    const { user } = await generateUserWithVerificationCode({
      user: { status: StatusEnum.PENDING },
      verificationCode: {
        expiryDate: new Date(),
        useCase: UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION
      }
    });
    const res = await post({
      query: VERIFY_PHONE_VERIFICATION_CODE,
      token: user.token,
      variables: {
        code: 'tttt'
      }
    });
    expect(res.body.data.response.code).toBe(624);
  });

  it('returns_success_if_user_verify_in_phone_verification', async () => {
    const helperService = new HelperService();
    const { expiryDate, code } = helperService.createVerificationCode();
    const { user, verificationCode } = await generateUserWithVerificationCode({
      user: { status: StatusEnum.PENDING },
      verificationCode: {
        expiryDate,
        code,
        useCase: UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION
      }
    });
    const res = await post({
      query: VERIFY_PHONE_VERIFICATION_CODE,
      token: user.token,
      variables: {
        code: String(code)
      }
    });
    const userVerificationCodeRepository = new UserVerificationCodeRepository();
    const removedOtp = await userVerificationCodeRepository.findUserVerificationCodeByFilter({
      where: {
        id: verificationCode.id
      }
    });

    const {
      data: { phone, unverifiedPhone }
    } = res.body.data.response;

    expect(res.body.data.response.code).toBe(200);
    expect(unverifiedPhone).toBeFalsy();
    expect(phone).toBe(user.unverifiedPhone);
    expect(removedOtp).toBeFalsy();
  });
});
