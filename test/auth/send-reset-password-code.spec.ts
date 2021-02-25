import { User } from 'src/user/models/user.model';
import { UserFactory } from 'src/user/user.factory';
import { OTHER_PHONE } from '../constants';
import { SEND_RESET_PASSWORD_CODE, VERIFY_RESET_PASSWORD_VERIFICATION_CODE } from '../graphql/auth';
import { post } from '../request';
import { rollbackDbForVerificationCode } from './rollback-for-auth';
import { HelperService } from 'src/_common/utils/helper.service';
import { StatusEnum, UserVerificationCodeUserCaseEnum } from 'src/user/user.enum';
import { generateUserWithVerificationCode } from './generate-auth-data';

describe('Send_Reset_password_code_suite_case', () => {
  afterEach(async () => {
    await rollbackDbForVerificationCode();
  });

  it('reset_password_code_send_successfully', async () => {
    const user = (await UserFactory({ obj: {} })) as User;
    const res = await post({
      query: SEND_RESET_PASSWORD_CODE,
      variables: {
        phone: user.phone
      }
    });

    expect(res.body.data.response.code).toBe(200);
  });

  it('do_not_return_error_if_phone_not_exist', async () => {
    const user = (await UserFactory({ obj: {} })) as User;
    const res = await post({
      query: SEND_RESET_PASSWORD_CODE,
      variables: {
        phone: OTHER_PHONE
      }
    });

    expect(res.body.data.response.code).toBe(200);
  });
  it('returns_error_when_user_phone_not_exist_in_code_verification', async () => {
    const user = (await UserFactory({ obj: {} })) as User;
    const helperService = new HelperService();
    const { expiryDate, code } = helperService.createVerificationCode();
    const res = await post({
      query: VERIFY_RESET_PASSWORD_VERIFICATION_CODE,
      variables: {
        input: {
          phone: OTHER_PHONE,
          code: String(code)
        }
      }
    });
    console.log(res);

    expect(res.body.data.response.code).toBe(606);
  });
});
