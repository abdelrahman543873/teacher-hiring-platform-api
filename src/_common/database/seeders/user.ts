import { SecurityGroupRepository } from 'src/security-group/security-group.repository';
import { User } from 'src/user/models/user.model.js';
import { UserRepository } from 'src/user/repositories/user.repository';
import { StatusEnum, UserRoleEnum } from 'src/user/user.enum';
import { UserFactory, UsersFactory } from 'src/user/user.factory';

export const seed = async ({ truncate, count }) => {
  const securityGroupRepository = new SecurityGroupRepository();
  const userRepository = new UserRepository();

  // Remove all records
  if (truncate) await userRepository.truncateUserModel();

  // Check super admin role existence
  const superAdminRole = await securityGroupRepository.findSecurityGroupByFilter({
    groupName: 'SuperAdmin'
  });
  if (!superAdminRole) {
    console.log('ERROR: Please seed roles first');
    process.exit(1);
  }

  // Seed super admin
  let superAdmin = await userRepository.findUserByFilter({
    where: { securityGroupId: superAdminRole.id }
  });
  if (!superAdmin) {
    superAdmin = (await UserFactory({
      obj: {
        securityGroupId: superAdminRole.id,
        email: 'admin@abjad.com',
        firstName: 'abjad',
        lastName: 'admin',
        password: '123456',
        isBlocked: false,
        isCompleted: true,
        status: StatusEnum.ACCEPTED,
        role: UserRoleEnum.SUPERADMIN
      }
    })) as User;
  }

  // Seed users
  return [...(await UsersFactory(count - 1)), superAdmin];
};
