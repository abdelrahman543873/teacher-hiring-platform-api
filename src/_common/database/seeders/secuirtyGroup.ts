import { getAllPermissions } from 'src/security-group/security-group-permissions';
import {
  SecurityGroupFactory,
  SecurityGroupsFactory
} from 'src/security-group/security-group.factory';
import { SecurityGroup } from 'src/security-group/security-group.model';
import { SecurityGroupRepository } from 'src/security-group/security-group.repository';

export const seed = async ({ truncate, count }) => {
  const securityGroupRepository = new SecurityGroupRepository();
  // Remove all records
  if (truncate) await securityGroupRepository.truncateSecurityGroupModel();
  // creat super admin
  let superAdminSecurityGroup = await securityGroupRepository.findSecurityGroupByFilter({
    groupName: 'SuperAdmin'
  });

  if (!superAdminSecurityGroup) {
    superAdminSecurityGroup = (await SecurityGroupFactory({
      obj: {
        groupName: 'SuperAdmin',
        permissions: getAllPermissions()
      }
    })) as SecurityGroup;
    console.log(superAdminSecurityGroup);
  }
  // Seed
  return [...(await SecurityGroupsFactory(count - 1)), superAdminSecurityGroup];
};
