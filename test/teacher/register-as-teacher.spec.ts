import { post } from '../request';
import { buildRegisterTeacherParams } from '../../src/teacher/teacher.factory';
import { rollbackDbForTeacher } from './rollback-for-teacher';
import { CREATE_TEACHER } from '../graphql/teacher';
import { UserFactory } from '../../src/user/user.factory';
import { SchoolFactory } from 'src/school/school.factory';

describe('teacher_registeration', () => {
  afterEach(async () => {
    await rollbackDbForTeacher();
  });

  it('teacher_registeration', async () => {
    const params = buildRegisterTeacherParams();
    const res = await post({
      query: CREATE_TEACHER,
      variables: { input: params }
    });
    expect(res.body.data.response.code).toBe(200);
  });

  it('error_if_user_exists_with_same_email', async () => {
    const params = buildRegisterTeacherParams();
    await UserFactory({ obj: { email: params.email } });
    const res = await post({
      query: CREATE_TEACHER,
      variables: { input: params }
    });
    expect(res.body.data.response.code).toBe(601);
  });

  it('error_if_user_exists_with_same_phone', async () => {
    const params = buildRegisterTeacherParams();
    await UserFactory({ obj: { phone: params.unverifiedPhone } });
    const res = await post({
      query: CREATE_TEACHER,
      variables: { input: params }
    });
    expect(res.body.data.response.code).toBe(602);
  });

  it('error_if_school_with_same_phone', async () => {
    const params = buildRegisterTeacherParams();
    await SchoolFactory({ obj: { phone: params.unverifiedPhone } });
    const res = await post({
      query: CREATE_TEACHER,
      variables: { input: params }
    });
    expect(res.body.data.response.code).toBe(602);
  });

  it('error_if_school_with_same_email', async () => {
    const params = buildRegisterTeacherParams();
    await SchoolFactory({ obj: { email: params.email } });
    const res = await post({
      query: CREATE_TEACHER,
      variables: { input: params }
    });
    expect(res.body.data.response.code).toBe(601);
  });
});
