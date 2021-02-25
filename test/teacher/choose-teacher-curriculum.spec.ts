import { post } from '../request';
import { TeachersFactory } from '../../src/teacher/teacher.factory';
import { rollbackDbForTeacher } from './rollback-for-teacher';
import { CHOOSE_TEACHER_CURRICULUM } from '../graphql/teacher';
import { AdminUserFactory } from '../../src/user/user.factory';
import { CurriculumFactory } from '../../src/curriculum/curriculum.factory';

describe('choose teacher curriculum suite case', () => {
  afterEach(async () => {
    await rollbackDbForTeacher();
  });

  it('choose_teacher_curriculum', async () => {
    const teacherId = (await TeachersFactory(1))[0].teacherId;
    const curriculumId = (await CurriculumFactory()).id;
    const admin = await AdminUserFactory();
    const res = await post({
      query: CHOOSE_TEACHER_CURRICULUM,
      variables: { teacherId, curriculumId },
      token: admin.token
    });
    expect(res.body.data.response.code).toBe(200);
    expect(res.body.data.response.data.id).toEqual(curriculumId);
  });
});
