import { AdminUserFactory } from '../../src/user/user.factory';
import { UPDATE_USER_STATUS } from '../graphql/user-updates';
import { post } from '../request';
import * as faker from 'faker';
import { getValuesFromEnum } from '../../src/_common/utils/columnEnum';
import { StatusEnum } from '../../src/user/user.enum';
import { rollbackDbForUser } from '../user/rollback-for-user';

describe('check update user status', () => {
  afterEach(async () => {
    await rollbackDbForUser();
  });

  it('update user status', async () => {
    const admin = await AdminUserFactory();
    let status = faker.random.arrayElement(getValuesFromEnum(StatusEnum));
    while (status === admin.status) {
      status = faker.random.arrayElement(getValuesFromEnum(StatusEnum));
    }
    const res = await post({
      query: UPDATE_USER_STATUS,
      variables: { input: { id: admin.id, status } },
      token: admin.token
    });
    expect(res.body.data.response.data.status).not.toBe(admin.status);
    expect(res.body.data.response.code).toBe(200);
  });

  it('error if id is empty', async () => {
    const admin = await AdminUserFactory();
    let status = faker.random.arrayElement(getValuesFromEnum(StatusEnum));
    while (status === admin.status) {
      status = faker.random.arrayElement(getValuesFromEnum(StatusEnum));
    }
    const input = { id: '', status };
    const res = await post({
      query: UPDATE_USER_STATUS,
      variables: { input },
      token: admin.token
    });
    expect(res.body.data.response.code).toBe(400);
  });
});
