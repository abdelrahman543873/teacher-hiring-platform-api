import { AdminUserFactory } from './../../src/user/user.factory';
import { post } from '../request';
import { buildTeacherParams } from '../../src/teacher/teacher.factory';
import { rollbackDbForTeacher } from './rollback-for-teacher';
import { COMPLETE_TEACHER_PROFILE } from '../graphql/teacher';

describe('complete_teacher_profile', () => {
  afterEach(async () => {
    await rollbackDbForTeacher();
  });

  it('complete_teacher_profile', async () => {
    const admin = await AdminUserFactory({ role: 'TEACHER', status: 'PENDING' });
    const params = await buildTeacherParams();
    delete params['teacherId'];
    const res = await post({
      query: COMPLETE_TEACHER_PROFILE,
      variables: { input: params },
      token: admin.token
    });
    expect(res.body.data.response.code).toBe(200);
  });

  it('empty_subjects_curriculums', async () => {
    const admin = await AdminUserFactory({ role: 'TEACHER', status: 'PENDING' });
    const params = await buildTeacherParams({ curriculums: [], subjects: [] });
    delete params['teacherId'];
    const res = await post({
      query: COMPLETE_TEACHER_PROFILE,
      variables: { input: params },
      token: admin.token
    });
    expect(res.body.data.response.code).toBe(400);
  });

  it('error_if_phone_not_verified', async () => {
    const admin = await AdminUserFactory({ role: 'TEACHER', status: 'PENDING', phone: null });
    const params = await buildTeacherParams();
    delete params['teacherId'];
    const res = await post({
      query: COMPLETE_TEACHER_PROFILE,
      variables: { input: params },
      token: admin.token
    });
    expect(res.body.data.response.code).toBe(605);
  });

  it('error_if_complete_teacher_profile_twice', async () => {
    const admin = await AdminUserFactory({ role: 'TEACHER', status: 'PENDING' });
    const params = await buildTeacherParams();
    delete params['teacherId'];
    const res = await post({
      query: COMPLETE_TEACHER_PROFILE,
      variables: { input: params },
      token: admin.token
    });
    const res1 = await post({
      query: COMPLETE_TEACHER_PROFILE,
      variables: { input: params },
      token: admin.token
    });
    expect(res1.body.data.response.code).toBe(648);
  });
});
