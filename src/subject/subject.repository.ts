import { Injectable } from '@nestjs/common';
import { Subject } from './models/subject.model';
import { SubjectInput } from './input/subject.input';
import { Op } from 'sequelize';
import { UpdateSubjectInput } from './input/update-subject.input';

@Injectable()
export class SubjectRepository {
  async findSubject(id: string) {
    return await Subject.findByPk(id);
  }

  async subjects() {
    return await Subject.findAll();
  }

  async subjectsIds() {
    return await Subject.findAll({ attributes: ['id'], raw: true });
  }

  async createSubject(subject: SubjectInput) {
    return await Subject.create(subject);
  }

  async findSubjectByArNameOrEnName(subject: SubjectInput) {
    return await Subject.findOne({
      where: { [Op.or]: [{ enName: subject.enName }, { arName: subject.arName }] }
    });
  }

  async updateExistingSubject(input: UpdateSubjectInput) {
    const updatedCurriculum = await Subject.update(input, {
      where: { id: input.id },
      returning: true
    });
    return updatedCurriculum[1][0];
  }

  async deleteSubject(id: string) {
    const deleted = await Subject.destroy({ where: { id } });
    if (deleted === 0) return false;
    return true;
  }

  async countSubjectsByIds(Ids: string[]) {
    return Subject.count({
      where: {
        id: Ids
      }
    });
  }

  buildInnerSubjectForGetTeacher(subjectsIds: string[]): Record<string, any> {
    return {
      model: Subject,
      where: {
        id: {
          [Op.in]: subjectsIds
        }
      },
      attributes: ['id']
    };
  }

  async rawDelete() {
    await Subject.sequelize.query(`delete from "Subjects"`);
  }
}
