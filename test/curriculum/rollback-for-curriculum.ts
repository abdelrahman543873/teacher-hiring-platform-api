import { CurriculumRepository } from '../../src/curriculum/curriculum.repository';
import { UserRepository } from '../../src/user/repositories/user.repository';
import { SecurityGroupRepository } from '../../src/security-group/security-group.repository';
export async function rollbackDbForCurriculum() {
  const CurriculmRepo = new CurriculumRepository();
  const userRepo = new UserRepository();
  const scurityGroupRepo = new SecurityGroupRepository();

  await userRepo.rawDelete();
  await CurriculmRepo.rawDelete();
  await scurityGroupRepo.rawDelete();
}
