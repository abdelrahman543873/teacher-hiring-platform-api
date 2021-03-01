import { post } from '../request';
import { CREATE_CURRICULUM } from '../graphql/curriculum';
import { buildCurriculumParams } from '../../src/curriculum/curriculum.factory';
import { AdminUserFactory } from '../../src/user/user.factory';
import { Curriculum } from '../../src/curriculum/models/curriculum.model';
import { rollbackDbForChat } from './rollback-for-chat';

describe('inbox suite case', () => {
  afterEach(async () => {
    await rollbackDbForChat();
  });

  it('get inbox successfully', async () => {
    const admin = await ChatFa();
    const params = buildCurriculumParams();
    await Curriculum.create(params);
    const res = await post({
      query: CREATE_CURRICULUM,
      variables: { input: params },
      token: admin.token
    });
    expect(res.body.data.response.code).toBe(640);
  });
});
