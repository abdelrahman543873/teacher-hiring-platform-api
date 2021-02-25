import { post } from '../request';
import { UPDATE_CURRICULUM } from '../graphql/curriculum';
import { rollbackDbForCurriculum } from './rollback-for-curriculum';
import { buildCurriculumParams, CurriculumFactory } from '../../src/curriculum/curriculum.factory';
import { AdminUserFactory } from '../../src/user/user.factory';

describe('update curriculum suite case', () => {
  afterEach(async () => {
    await rollbackDbForCurriculum();
  });
  it('error_if_wrong_permission', async () => {
    const input = await buildCurriculumParams();
    const curriculum = await CurriculumFactory();
    input['id'] = curriculum.id;
    const res = await post({
      query: UPDATE_CURRICULUM,
      variables: { input }
    });
    expect(res.body.data.response.code).toBe(600);
  });

  it('update_curriculum', async () => {
    const input = await buildCurriculumParams();
    const admin = await AdminUserFactory();
    const curriculum = await CurriculumFactory();
    input['id'] = curriculum.id;
    const res = await post({
      query: UPDATE_CURRICULUM,
      variables: { input },
      token: admin.token
    });
    expect(res.body.data.response.code).toBe(200);
  });
});
