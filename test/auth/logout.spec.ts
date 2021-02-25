import { User } from 'src/user/models/user.model';
import { UserFactory } from 'src/user/user.factory';
import { rollbackDbForVerificationCode } from './rollback-for-auth';
import { LOGOUT } from '../graphql/auth';
import { DeviceEnum } from '../../src/user/user.enum';
import { post } from '../request';

describe('logout_suite_case', () => {
  afterEach(async () => {
    await rollbackDbForVerificationCode();
  });
  it('logout_successfully', async () => {
    const user = (await UserFactory({})) as User;
    const res = await post({
      query: LOGOUT,
      token: user.token,
      variables: { input: DeviceEnum.ANDROID }
    });
    expect(res.body.data.response.code).toBe(200);
  });
});
