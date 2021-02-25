import { UserRepository } from '../../src/user/repositories/user.repository';
import { SubjectRepository } from '../../src/subject/subject.repository';
import { SecurityGroupRepository } from '../../src/security-group/security-group.repository';
import { TeacherSubject } from '../../src/subject/models/teacher-subject.model';
import { TeacherCurriculum } from '../../src/curriculum/models/teacher-curriculum.model';
import { CurriculumRepository } from '../../src/curriculum/curriculum.repository';
import { SchoolRepository } from '../../src/school/school.repository';
export async function rollbackDbForTeacher() {
  const subjectRepo = new SubjectRepository();
  const userRepo = new UserRepository();
  const securityGroupRepo = new SecurityGroupRepository();
  const curriculumRepo = new CurriculumRepository();
  const schoolRepo = new SchoolRepository();

  await userRepo.rawDelete();
  await subjectRepo.rawDelete();
  await securityGroupRepo.rawDelete();
  await curriculumRepo.rawDelete();
  await schoolRepo.rawDelete();
  await TeacherSubject.sequelize.query(`delete from "TeacherSubjects"`);
  await TeacherCurriculum.sequelize.query(`delete from "TeacherCurriculums"`);
}
