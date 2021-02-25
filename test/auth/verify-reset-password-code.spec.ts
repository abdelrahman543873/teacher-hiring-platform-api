import { VERIFY_RESET_PASSWORD_VERIFICATION_CODE } from '../graphql/auth';
import { post } from '../request';
import { HelperService } from 'src/_common/utils/helper.service';
import { StatusEnum, UserVerificationCodeUserCaseEnum } from 'src/user/user.enum';
import { generateUserWithVerificationCode } from './generate-auth-data';
import { rollbackDbForVerificationCode } from './rollback-for-auth';

describe('Verify_reset_password_code', () => {
  afterEach(async () => {
    await rollbackDbForVerificationCode();
  });
  it('returns_error_if_user_in_rejected_status_in_code_verification', async () => {
    const helperService = new HelperService();
    const { expiryDate, code } = helperService.createVerificationCode();
    const { user, verificationCode } = await generateUserWithVerificationCode({
      user: { status: StatusEnum.REJECTED },
      verificationCode: {
        expiryDate,
        useCase: UserVerificationCodeUserCaseEnum.PASSWORD_RESET
      }
    });
    const res = await post({
      query: VERIFY_RESET_PASSWORD_VERIFICATION_CODE,
      variables: {
        input: {
          phone: user.phone,
          code: verificationCode.code
        }
      }
    });
    expect(res.body.data.response.code).toBe(606);
  });

  it('returns_error_if_user_has_expired_otp', async () => {
    const helperService = new HelperService();
    const { expiryDate, code } = helperService.createVerificationCode();
    const { user, verificationCode } = await generateUserWithVerificationCode({
      user: { status: StatusEnum.PENDING },
      verificationCode: {
        expiryDate: new Date(),
        useCase: UserVerificationCodeUserCaseEnum.PASSWORD_RESET
      }
    });
    const res = await post({
      query: VERIFY_RESET_PASSWORD_VERIFICATION_CODE,
      variables: {
        input: {
          phone: user.phone,
          code: verificationCode.code
        }
      }
    });
    expect(res.body.data.response.code).toBe(625);
  });

  it('returns_true_if_user_has_otp', async () => {
    const helperService = new HelperService();
    const { expiryDate, code } = helperService.createVerificationCode();
    const { user, verificationCode } = await generateUserWithVerificationCode({
      user: { status: StatusEnum.PENDING },
      verificationCode: {
        expiryDate,
        useCase: UserVerificationCodeUserCaseEnum.PASSWORD_RESET
      }
    });
    const res = await post({
      query: VERIFY_RESET_PASSWORD_VERIFICATION_CODE,
      variables: {
        input: {
          phone: user.phone,
          code: verificationCode.code
        }
      }
    });
    expect(res.body.data.response.code).toBe(200);
  });
});
