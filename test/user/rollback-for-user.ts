import { UserRepository } from '../../src/user/repositories/user.repository';
import { SecurityGroupRepository } from '../../src/security-group/security-group.repository';
import { TeacherRepository } from '../../src/teacher/teacher.repository';
import { SchoolRepository } from 'src/school/school.repository';

export async function rollbackDbForUser() {
  const userRepo = new UserRepository();
  const securityGroupRepo = new SecurityGroupRepository();
  const teacherRepo = new TeacherRepository();
  const schoolRepo = new SchoolRepository();

  await userRepo.rawDelete();
  await securityGroupRepo.rawDelete();
  await teacherRepo.rawDelete();
  await schoolRepo.rawDelete();
}
