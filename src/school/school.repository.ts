import { Injectable } from '@nestjs/common';
import { CountOptions, CreateOptions, DestroyOptions, FindOptions, UpdateOptions } from 'sequelize';

import { School } from './models/school.model';
import { Curriculum } from '../curriculum/models/curriculum.model';
import { models } from 'src/_common/database/database.models';

@Injectable()
export class SchoolRepository {
  private readonly Model = School;

  async findSchoolByFilter(input: FindOptions): Promise<School> {
    return await this.Model.findOne(input);
  }

  async countSchoolByFilter(input: CountOptions): Promise<number> {
    return await this.Model.count(input);
  }

  async createSchool(input: { options?: CreateOptions; values?: Record<string, any> }) {
    return await this.Model.create(input.values, input.options);
  }

  async findSchoolsByAdminIds(adminIds: string[]) {
    return await this.Model.findAll({
      where: {
        schoolAdminId: adminIds
      }
    });
  }

  async findSchoolsCurriculums(curriculumIDs: string[]) {
    return await School.findAll({
      where: {
        id: curriculumIDs
      },
      attributes: ['id'],
      include: [{ model: Curriculum, through: { attributes: [] } }]
    });
  }

  async findSchoolByPhone(phone: string) {
    return await this.Model.findOne({
      where: {
        phone
      },
      attributes: ['id']
    });
  }

  async findSchoolByName(name: string) {
    return await this.Model.findOne({
      where: {
        name
      },
      attributes: ['id']
    });
  }

  async findSchoolByLandlineNumber(landlineNumber: string) {
    return await this.Model.findOne({
      where: {
        landlineNumber
      },
      attributes: ['id']
    });
  }

  async findSchoolByEmail(email: string) {
    return await this.Model.findOne({
      where: {
        email
      },
      attributes: ['id']
    });
  }

  async findSchoolsByAdminId(adminId) {
    return await this.Model.findAll({
      where: {
        schoolAdminId: adminId
      },
      attributes: ['id']
    });
  }

  async findSchoolLocationByAdminId(adminId: string) {
    return await this.Model.findOne({
      where: {
        schoolAdminId: adminId
      },
      attributes: ['location'],
      logging: console.log
    });
  }

  async updateSchoolsByFilter(values: Record<string, any>, input: UpdateOptions) {
    return await this.Model.update(values, input);
  }

  async removeByFilter(input: DestroyOptions) {
    return this.Model.destroy(input);
  }

  async createSchools(models: Record<string, any>[]) {
    return await this.Model.bulkCreate(models);
  }

  async truncateSchoolModel() {
    return await this.Model.truncate({ cascade: true, force: true });
  }

  async rawDelete() {
    await this.Model.sequelize.query(`delete from "Schools"`);
  }

  transaction = t => {
    return this.Model.sequelize.transaction(t);
  };
}
