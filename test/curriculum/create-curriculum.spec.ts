import { post } from '../request';
import { CREATE_CURRICULUM } from '../graphql/curriculum';
import { rollbackDbForCurriculum } from './rollback-for-curriculum';
import { buildCurriculumParams } from '../../src/curriculum/curriculum.factory';
import { AdminUserFactory } from '../../src/user/user.factory';
import { Curriculum } from '../../src/curriculum/models/curriculum.model';

describe('create curriculum suite case', () => {
  afterEach(async () => {
    await rollbackDbForCurriculum();
  });
  it('error_if_wrong_permission', async () => {
    const input = await buildCurriculumParams();
    const res = await post({
      query: CREATE_CURRICULUM,
      variables: { input }
    });
    expect(res.body.data.response.code).toBe(600);
  });

  it('create_curriculum', async () => {
    const input = await buildCurriculumParams();
    const admin = await AdminUserFactory();
    const res = await post({
      query: CREATE_CURRICULUM,
      variables: { input },
      token: admin.token
    });
    expect(res.body.data.response.code).toBe(200);
  });

  it('create_empty_curriculum', async () => {
    const admin = await AdminUserFactory();
    const res = await post({
      query: CREATE_CURRICULUM,
      variables: { input: {} },
      token: admin.token
    });
    expect(res.body).toHaveProperty('errors');
  });

  it('create_empty_curriculum_names', async () => {
    const admin = await AdminUserFactory();
    const res = await post({
      query: CREATE_CURRICULUM,
      variables: { input: { enName: '', arName: '' } },
      token: admin.token
    });
    expect(res.body.data.response.code).toBe(400);
  });

  it('create_already_existing_curriculum', async () => {
    const admin = await AdminUserFactory();
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
