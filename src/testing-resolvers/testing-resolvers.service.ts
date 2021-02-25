import { AdminUserFactory } from './../user/user.factory';
import { Injectable } from '@nestjs/common';
import { UsersFactory } from '../user/user.factory';
import { User } from '../user/models/user.model';
import { Op } from 'sequelize';
import * as jwt from 'jsonwebtoken';
import { env } from '../_common/utils/env';

@Injectable()
export class TestingResolversService {
  async createAdminToken() {
    const admin = await AdminUserFactory();
    return admin.token;
  }

  async getAdminToken() {
    const user = await User.findOne({ where: { securityGroupId: { [Op.ne]: null } } });
    return jwt.sign({ userId: user.id }, env.JWT_SECRET);
  }

  async createFakeUsers() {
    return await UsersFactory();
  }

  async getUsers() {
    return await User.findAll();
  }
}
