import { WhereOptions } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { SecurityGroup } from './security-group.model';

@Injectable()
export class SecurityGroupRepository {
  async findSecurityGroupByFilter(where: WhereOptions = {}) {
    return await SecurityGroup.findOne({ where });
  }
  async rawDelete() {
    await SecurityGroup.sequelize.query(`delete from "SecurityGroups"`);
  }
  async findSecurityGroupsByFilter(where: WhereOptions = {}) {
    return await SecurityGroup.findAll({ where });
  }

  async updateSecurityGroupFromExistingModel(securityGroup: SecurityGroup, input = {}) {
    return await securityGroup.update(input);
  }

  async createSecurityGroup(input = {}) {
    return await SecurityGroup.create(input);
  }

  async createSecurityGroups(models: {}[]) {
    return await SecurityGroup.bulkCreate(models);
  }

  async truncateSecurityGroupModel() {
    return await SecurityGroup.truncate({ force: true, cascade: true });
  }
}
