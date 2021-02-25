import * as faker from 'faker';
import { permissions } from './security-group-permissions';
import { SecurityGroup } from './security-group.model';
import { SecurityGroupRepository } from './security-group.repository';

const securityGroupRepo = new SecurityGroupRepository();

function getRandomPermissions(): string[] {
  const modules = Object.keys(permissions);
  return permissions[modules[faker.random.number(modules.length - 1)]];
}

type SecurityGroupType = {
  id?: string;
  groupName: string;
  description?: string;
  permissions: string[];
};

function buildParams(obj = <any>{}): SecurityGroupType {
  return {
    groupName: obj.groupName || faker.name.title(),
    description: obj.description || faker.lorem.paragraph(),
    permissions: obj.permissions || getRandomPermissions()
  };
}

export const SecurityGroupsFactory = async (
  count: number = 10,
  obj = <any>{}
): Promise<SecurityGroup[]> => {
  let securityGroups = [];
  for (let i = 0; i < count; i++) {
    securityGroups.push(buildParams(obj));
  }
  return await securityGroupRepo.createSecurityGroups(securityGroups);
};

export const SecurityGroupFactory = async ({
  paramsOnly = false,
  obj = <any>{}
}): Promise<SecurityGroup | SecurityGroupType> => {
  const params = buildParams(obj);
  if (paramsOnly) return params;
  return await securityGroupRepo.createSecurityGroup(params);
};
