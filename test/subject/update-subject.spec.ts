import { buildSubjectParams } from './../../src/subject/subject.factory';
import { rollbackDbForSubject } from './rollback-for-subject';
import { UPDATE_SUBJECT } from '../graphql/subject';
import { SubjectFactory } from '../../src/subject/subject.factory';
import { AdminUserFactory } from '../../src/user/user.factory';
import { post } from '../request';
describe('update subject suite case', () => {
  afterEach(async () => {
    await rollbackDbForSubject();
  });
  it('error_if_wrong_permission', async () => {
    const input = await buildSubjectParams();
    input['id'] = (await SubjectFactory()).id;
    const res = await post({
      query: UPDATE_SUBJECT,
      variables: { input }
    });
    expect(res.body.data.response.code).toBe(600);
  });

  it('subject_udpated', async () => {
    const input = await buildSubjectParams();
    input['id'] = (await SubjectFactory()).id;
    const admin = await AdminUserFactory();
    const res = await post({
      query: UPDATE_SUBJECT,
      variables: { input },
      token: admin.token
    });
    expect(res.body.data.response.code).toBe(200);
  });
});
