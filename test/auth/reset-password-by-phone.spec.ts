import { UserVerificationCodeUserCaseEnum, StatusEnum } from 'src/user/user.enum';
import { OTHER_PHONE, PASSWORD, PHONE } from '../constants';
import { RESET_PASSWORD_BY_PHONE } from '../graphql/auth';
import { post } from '../request';
import { generateUserWithVerificationCode } from './generate-auth-data';
import { rollbackDbForVerificationCode } from './rollback-for-auth';

describe('reset_Password_by_password_suite_case', () => {
  afterEach(async () => {
    await rollbackDbForVerificationCode();
  });
  it('reset_password_by_phone', async () => {
    const { user, verificationCode } = await generateUserWithVerificationCode({
      verificationCode: {
        useCase: UserVerificationCodeUserCaseEnum.PASSWORD_RESET,
        expiryDate: new Date().valueOf() + 300000
      },
      user: {
        status: StatusEnum.PENDING
      }
    });
    const res = await post({
      query: RESET_PASSWORD_BY_PHONE,
      variables: {
        input: {
          phone: user.phone,
          code: verificationCode.code,
          newPassword: PASSWORD
        }
      }
    });
    expect(res.body.data.response.code).toBe(200);
    expect(res.body.data.response.data.phone).toBe(user.phone);
  });

  it('return_error_if_phone_not_exist_or_not_not_verified', async () => {
    const { user, verificationCode } = await generateUserWithVerificationCode({
      user: {
        status: StatusEnum.PENDING
      }
    });
    const res = await post({
      query: RESET_PASSWORD_BY_PHONE,
      variables: {
        input: {
          phone: OTHER_PHONE,
          code: verificationCode.code,
          newPassword: PASSWORD
        }
      }
    });
    expect(res.body.data.response.code).toBe(606);
  });

  it('return_error_if_code_expired', async () => {
    const { user, verificationCode } = await generateUserWithVerificationCode({
      verificationCode: {
        useCase: UserVerificationCodeUserCaseEnum.PASSWORD_RESET,
        expiryDate: new Date()
      },
      user: {
        status: StatusEnum.PENDING
      }
    });
    const res = await post({
      query: RESET_PASSWORD_BY_PHONE,
      variables: {
        input: {
          phone: user.phone,
          code: verificationCode.code,
          newPassword: PASSWORD
        }
      }
    });
    expect(res.body.data.response.code).toBe(625);
  });
});
