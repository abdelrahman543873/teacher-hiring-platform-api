import { UsersFactory, AdminUserFactory } from '../../src/user/user.factory';
import { VIEW_USERS_REQUESTS } from '../graphql/user-updates';
import { post } from '../request';
import { rollbackDbForUser } from '../user/rollback-for-user';
import { TeacherOrSchoolAdminEnum } from '../../src/user-updates/user-updates.enum';
import { UserRoleEnum } from 'src/user/user.enum';
import { StatusEnum } from '../../src/user/user.enum';

describe('view_user_status ', () => {
  afterEach(async () => {
    await rollbackDbForUser();
  });

  it('view_teacher_status', async () => {
    const admin = await AdminUserFactory({ role: UserRoleEnum.SUPERADMIN });
    await UsersFactory(10, { status: StatusEnum.PENDING, role: UserRoleEnum.TEACHER });
    const res = await post({
      query: VIEW_USERS_REQUESTS,
      variables: {
        input: {
          filterBy: {
            role: TeacherOrSchoolAdminEnum.TEACHER
          },
          limit: 10
        }
      },
      token: admin.token
    });
    expect(res.body.data.response.data.items.length).toBe(10);
    expect(res.body.data.response.code).toBe(200);
  });

  it('view_schoolAdmin_status', async () => {
    const admin = await AdminUserFactory({ role: UserRoleEnum.SUPERADMIN });
    await UsersFactory(10, { status: StatusEnum.PENDING, role: UserRoleEnum.SCHOOLADMIN });
    const res = await post({
      query: VIEW_USERS_REQUESTS,
      variables: {
        input: {
          filterBy: {
            role: TeacherOrSchoolAdminEnum.SCHOOLADMIN
          },
          limit: 10
        }
      },
      token: admin.token
    });
    expect(res.body.data.response.code).toBe(200);
    expect(res.body.data.response.data.items.length).toBe(10);
  });
});
