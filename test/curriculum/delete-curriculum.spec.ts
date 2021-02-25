import { post } from '../request';
import { DELETE_CURRICULUM } from '../graphql/curriculum';
import { rollbackDbForCurriculum } from './rollback-for-curriculum';
import { CurriculumFactory } from '../../src/curriculum/curriculum.factory';
import { AdminUserFactory } from '../../src/user/user.factory';

describe('delete curriculum suite case', () => {
  afterEach(async () => {
    await rollbackDbForCurriculum();
  });
  it('error_if_wrong_permission', async () => {
    const curriculum = await CurriculumFactory();
    const res = await post({
      query: DELETE_CURRICULUM,
      variables: { id: curriculum.id }
    });
    expect(res.body.data.response.code).toBe(600);
  });

  it('delete_curriculum', async () => {
    const admin = await AdminUserFactory();
    const curriculum = await CurriculumFactory();
    const res = await post({
      query: DELETE_CURRICULUM,
      variables: { id: curriculum.id },
      token: admin.token
    });
    expect(res.body.data.response.code).toBe(200);
  });
});
