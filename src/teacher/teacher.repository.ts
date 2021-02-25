import { Teacher } from './models/teacher.model';
import { Subject } from '../subject/models/subject.model';
import { Curriculum } from '../curriculum/models/curriculum.model';
import { TeacherSubject } from '../subject/models/teacher-subject.model';
import { TeacherCurriculum } from '../curriculum/models/teacher-curriculum.model';
import { User } from '../user/models/user.model';
import { registerAsTeacherInput } from './inputs/register-as-teacher.input';
import { Injectable } from '@nestjs/common';
import { UserRoleEnum } from '../user/user.enum';
import { Op } from 'sequelize';
import { FcmTokensType } from '../user/user.interface';
import { CompleteTeacherRegisterationInput } from './inputs/complete-teacher-registeration.input';
import { School } from '../school/models/school.model';

@Injectable()
export class TeacherRepository {
  async findTeacherSubjects(teacherIDs: string[]) {
    return await Teacher.findAll({
      where: {
        teacherId: teacherIDs
      },
      attributes: ['teacherId'],
      include: [{ model: Subject, through: { attributes: [] } }]
    });
  }

  async findTeacherCurriculums(teacherIDs: string[]) {
    return await Teacher.findAll({
      where: {
        teacherId: teacherIDs
      },
      attributes: ['teacherId'],
      include: [{ model: Curriculum, through: { attributes: [] } }]
    });
  }

  async findTeacher(id: string) {
    return await Teacher.findByPk(id);
  }

  async createTeacher(id: string, completeTeacher: CompleteTeacherRegisterationInput, transaction) {
    return await Teacher.create({ teacherId: id, ...completeTeacher }, { transaction });
  }

  async rawDelete() {
    await Teacher.sequelize.query(`delete from "Teachers"`);
  }

  async updateTeacher(
    id: string,
    updateTeacherData: CompleteTeacherRegisterationInput,
    transaction
  ) {
    return await Teacher.update(updateTeacherData, {
      where: { teacherId: id },
      returning: true,
      transaction
    });
  }

  async createTeacherCurriculums(teacherCurriculums, transaction) {
    return await TeacherCurriculum.bulkCreate(teacherCurriculums, { transaction });
  }

  async createTeacherSubject(teacherSubjects, transaction) {
    return await TeacherSubject.bulkCreate(teacherSubjects, { transaction });
  }

  async findExistingTeacher(teacherInput: registerAsTeacherInput) {
    return await User.findOne({
      where: {
        [Op.or]: [
          { phone: teacherInput.unverifiedPhone },
          { email: teacherInput.email.toLowerCase() }
        ]
      }
    });
  }

  async findExistingSchool(teacherInput: registerAsTeacherInput) {
    return await School.findOne({
      where: {
        [Op.or]: [
          { phone: teacherInput.unverifiedPhone },
          { email: teacherInput.email.toLowerCase() }
        ]
      }
    });
  }

  async chooseTeacherSubject(teacherId: string, subjectId: string) {
    await TeacherSubject.create({ teacherId, subjectId });
    return await Subject.findByPk(subjectId);
  }

  async chooseTeacherCurriculum(teacherId: string, curriculumId: string) {
    await TeacherCurriculum.create({ teacherId, curriculumId });
    return await Curriculum.findByPk(curriculumId);
  }
}
