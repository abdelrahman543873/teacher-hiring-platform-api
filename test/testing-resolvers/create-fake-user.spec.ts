import { post } from '../request';
import { CREATE_FAKE_USERS } from '../graphql/testing-resolvers';
import { rollbackDbForTesting } from './rollback-for-testing';

describe('create fake users ', () => {
  afterEach(async () => {
    await rollbackDbForTesting;
  });
  it('create_fake_users', async () => {
    const res = await post({ query: CREATE_FAKE_USERS });
    expect(res.body.data.response.data).toBeTruthy();
    expect(res.body.data.response.code).toBe(200);
  });
});
