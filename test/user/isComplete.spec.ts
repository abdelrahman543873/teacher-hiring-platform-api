import { post } from '../request';
import { FIND_USER } from '../graphql/user';
import { rollbackDbForUser } from './rollback-for-user';
import { UserFactory } from '../../src/user/user.factory';
import { User } from '../../src/user/models/user.model';
import { buildTeacherParams, TeacherFactory } from '../../src/teacher/teacher.factory';
import { Teacher } from '../../src/teacher/models/teacher.model';
import { SchoolFactory } from 'src/school/school.factory';
import { UserRoleEnum } from '../../src/user/user.enum';

describe('isCompelte', () => {
  afterEach(async () => {
    await rollbackDbForUser();
  });

  it('is_complete_false', async () => {
    const user = (await UserFactory({})) as User;
    const res = await post({
      query: FIND_USER,
      variables: { id: user.id }
    });
    expect(res.body.data.response.data.isComplete).toBe(false);
  });

  it('is_complete_teacher_true', async () => {
    const user = (await UserFactory({ obj: { role: UserRoleEnum.TEACHER } })) as User;
    await TeacherFactory({ teacherId: user.id });
    const res = await post({
      query: FIND_USER,
      variables: { id: user.id }
    });
    expect(res.body.data.response.data.isComplete).toBe(true);
  });

  it('is_complete_school_true', async () => {
    const user = (await UserFactory({ obj: { role: UserRoleEnum.SCHOOLADMIN } })) as User;
    await SchoolFactory({ obj: { schoolAdminId: user.id } });
    const res = await post({
      query: FIND_USER,
      variables: { id: user.id }
    });
    expect(res.body.data.response.data.isComplete).toBe(true);
  });
});
