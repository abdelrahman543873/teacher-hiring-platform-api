import { UserRepository } from '../../src/user/repositories/user.repository';
import { SubjectRepository } from '../../src/subject/subject.repository';
import { SecurityGroupRepository } from '../../src/security-group/security-group.repository';
export async function rollbackDbForSubject() {
  const subjectRepo = new SubjectRepository();
  const userRepo = new UserRepository();
  const securityGroupRepo = new SecurityGroupRepository();

  await userRepo.rawDelete();
  await subjectRepo.rawDelete();
  await securityGroupRepo.rawDelete();
}
