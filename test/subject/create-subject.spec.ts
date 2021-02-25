import { buildSubjectParams } from './../../src/subject/subject.factory';
import { post } from '../request';
import { rollbackDbForSubject } from './rollback-for-subject';
import { CREATE_SUBJECT } from '../graphql/subject';
import { AdminUserFactory } from '../../src/user/user.factory';
import { SubjectFactory } from '../../src/subject/subject.factory';

describe('create subject suite case', () => {
  afterEach(async () => {
    await rollbackDbForSubject();
  });
  it('error_if_wrong_permission', async () => {
    const input = await buildSubjectParams();
    const res = await post({
      query: CREATE_SUBJECT,
      variables: { input }
    });
    expect(res.body.data.response.code).toBe(600);
  });

  it('create_subject', async () => {
    const input = await buildSubjectParams();
    const admin = await AdminUserFactory();
    const res = await post({
      query: CREATE_SUBJECT,
      variables: { input },
      token: admin.token
    });
    expect(res.body.data.response.code).toBe(200);
  });

  it('create_empty_subject', async () => {
    const admin = await AdminUserFactory();
    const res = await post({
      query: CREATE_SUBJECT,
      variables: { input: {} },
      token: admin.token
    });
    expect(res.body).toHaveProperty('errors');
  });

  it('create_duplicate_subject', async () => {
    const admin = await AdminUserFactory();
    await SubjectFactory({ enName: 'hello' });
    const res = await post({
      query: CREATE_SUBJECT,
      variables: { input: { enName: 'hello', arName: 'hello' } },
      token: admin.token
    });
    console.log(res.body);
    expect(res.body.data.response.code).toBe(648);
  });
});
