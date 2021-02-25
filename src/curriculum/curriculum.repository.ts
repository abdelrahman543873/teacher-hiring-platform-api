import { Injectable } from '@nestjs/common';
import { Curriculum } from './models/curriculum.model';
import { CurriculumInput } from './inputs/curriculum.input';
import { Op } from 'sequelize';
import { UpdateCurriculumInput } from './inputs/update-curriculum.input';

@Injectable()
export class CurriculumRepository {
  async findCurriculumbyArNameEnName(curriculum: CurriculumInput) {
    return await Curriculum.findOne({
      where: {
        [Op.or]: [
          ...(curriculum.enName ? [{ enName: curriculum.enName }] : []),
          ...(curriculum.arName ? [{ arName: curriculum.arName }] : [])
        ]
      }
    });
  }
  async Curriculums() {
    return await Curriculum.findAll();
  }

  async curriculumsIds() {
    return await Curriculum.findAll({ attributes: ['id'], raw: true });
  }

  async findCurriculumByID(id: string) {
    return await Curriculum.findByPk(id);
  }

  async createCurriculum(curriculum: CurriculumInput) {
    return await Curriculum.create(curriculum);
  }

  async updateCurriculum(curriculum: UpdateCurriculumInput) {
    const updatedCurriculum = await Curriculum.update(curriculum, {
      where: { id: curriculum.id },
      returning: true
    });
    return updatedCurriculum[1][0];
  }
  async rawDelete() {
    return await Curriculum.sequelize.query(`delete from "Curriculums"`);
  }

  async deleteCurriculum(id: string) {
    const deleted = await Curriculum.destroy({ where: { id } });
    if (deleted === 0) return false;
    return true;
  }

  async countCurriculumByIds(ids: string[]) {
    return await Curriculum.count({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    });
  }
  buildInnerCurriculumForGetTeacher(curriculumsIds: string[]): Record<string, any> {
    return {
      model: Curriculum,
      where: {
        id: {
          [Op.in]: curriculumsIds
        }
      },
      attributes: ['id']
    };
  }
}
