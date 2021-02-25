import { SubjectFactory } from '../../src/subject/subject.factory';
import { post } from '../request';
import { DELETE_SUBJECT } from '../graphql/subject';
import { AdminUserFactory } from '../../src/user/user.factory';
import { rollbackDbForSubject } from './rollback-for-subject';

describe('delete subject suite case', () => {
  afterEach(async () => {
    await rollbackDbForSubject();
  });
  it('error_if_wrong_permission', async () => {
    const subject = await SubjectFactory();
    const res = await post({
      query: DELETE_SUBJECT,
      variables: { id: subject.id }
    });
    expect(res.body.data.response.code).toBe(600);
  });

  it('delete_subject', async () => {
    const admin = await AdminUserFactory();
    const subject = await SubjectFactory();
    const res = await post({
      query: DELETE_SUBJECT,
      variables: { id: subject.id },
      token: admin.token
    });
    expect(res.body.data.response.code).toBe(200);
  });
});
