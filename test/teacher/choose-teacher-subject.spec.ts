import { post } from '../request';
import { TeachersFactory } from '../../src/teacher/teacher.factory';
import { rollbackDbForTeacher } from './rollback-for-teacher';
import { CHOOSE_TEACHER_SUBJECT } from '../graphql/teacher';
import { SubjectFactory } from '../../src/subject/subject.factory';
import { AdminUserFactory } from '../../src/user/user.factory';

describe('choose teacher subject suite case', () => {
  afterEach(async () => {
    await rollbackDbForTeacher();
  });

  it('choose_teacher_subject', async () => {
    const teacherId = (await TeachersFactory(1))[0].teacherId;
    const subjectId = (await SubjectFactory()).id;
    const admin = await AdminUserFactory();
    const res = await post({
      query: CHOOSE_TEACHER_SUBJECT,
      variables: { teacherId, subjectId },
      token: admin.token
    });
    expect(res.body.data.response.code).toBe(200);
    expect(res.body.data.response.data.id).toEqual(subjectId);
  });
});
