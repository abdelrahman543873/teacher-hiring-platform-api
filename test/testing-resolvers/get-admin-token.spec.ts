import { AdminUserFactory } from './../../src/user/user.factory';
import { post } from '../request';
import { GET_ADMIN_TOKEN } from '../graphql/testing-resolvers';
import { rollbackDbForTesting } from './rollback-for-testing';

describe('get admin token', () => {
  afterEach(async () => {
    await rollbackDbForTesting;
  });

  it('return_admin_token', async () => {
    await AdminUserFactory();
    const res = await post({ query: GET_ADMIN_TOKEN });
    expect(res.body.data.response.code).toBe(200);
  });
});
