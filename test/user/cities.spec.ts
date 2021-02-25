import { post } from '../request';
import { CITIES } from '../graphql/user';

describe('get cities', () => {
  it('update user status', async () => {
    const res = await post({
      query: CITIES
    });
    expect(res.body.data.response.code).toBe(200);
    expect(res.body.data.response.data.length).toBeGreaterThan(1);
  });
});
