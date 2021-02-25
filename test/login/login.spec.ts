import { post } from '../request';
import { UserFactory } from '../../src/user/user.factory';
import { LOGIN } from '../graphql/login';
import { rollbackDbForLogin } from './rollback-for-login';

describe('login', () => {
  afterEach(async () => {
    await rollbackDbForLogin();
  });

  it('successful_login', async () => {
    const user = await UserFactory({ paramsOnly: false, obj: { password: 'something' } });
    const loginInput = { phone: user.phone, password: 'something', device: 'IOS' };
    const res = await post({
      query: LOGIN,
      variables: { loginInput }
    });
    expect(res.body.data.response.code).toBe(200);
  });

  it('unsuccessful_login_if_already_user_exist', async () => {
    const user = await UserFactory({ paramsOnly: false, obj: { password: 'something' } });
    const loginInput = { phone: user.phone, password: 'somethingelse', device: 'IOS' };
    const res = await post({
      query: LOGIN,
      variables: { loginInput }
    });
    expect(res.body.data.response.code).toBe(632);
  });

  it('unsuccessful_login_if_no_user_exist', async () => {
    const loginInput = { phone: '+201011760180', password: 'somethingelse', device: 'IOS' };
    const res = await post({
      query: LOGIN,
      variables: { loginInput }
    });
    expect(res.body.data.response.code).toBe(632);
  });
});
