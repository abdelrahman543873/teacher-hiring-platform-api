import { Injectable } from '@nestjs/common';
import { User } from '../models/user.model';
import {
  WhereOptions,
  Includeable,
  Transaction,
  CreateOptions,
  FindOptions,
  Op,
  UpdateOptions,
  QueryTypes,
  Sequelize
} from 'sequelize';
import { SecurityGroup } from 'src/security-group/security-group.model';
import { UserVerificationCode } from '../models/user-verification-code.model';
import {
  GenderEnum,
  SearchByUserGenderEnum,
  UserRoleEnum,
  UserVerificationCodeUserCaseEnum
} from '../user.enum';
import { StatusEnum } from '../user.enum';
import { Teacher } from '../../teacher/models/teacher.model';
import { School } from '../../school/models/school.model';

@Injectable()
export class UserRepository {
  private readonly Model = User;

  async findUserByFilter(input: FindOptions) {
    return await this.Model.findOne(input);
  }

  async findUsersByFilter(where: WhereOptions = {}, include: any[] = [], order?: any[]) {
    return await this.Model.findAll({
      where,
      include,
      logging: console.log,
      subQuery: false,
      order
    });
  }

  async f(f: FindOptions) {
    return this.Model.findAll(f);
  }

  async users() {
    return this.Model.findAll();
  }

  async superAdmins() {
    const superAdminRole = await SecurityGroup.findOne({ where: { name: 'SuperAdmin' } });
    if (!superAdminRole) return [];
    return await this.Model.findAll({ where: { roleId: superAdminRole.id } });
  }

  async rawDelete() {
    await this.Model.sequelize.query(`delete from "Users"`);
  }

  async findPaginatedUsersByFilter(
    filter,
    sort,
    attributes,
    page = 0,
    limit = 15,
    include: Includeable[] = []
  ) {
    return await this.Model.paginate({ filter, sort, page, limit, include, attributes });
  }

  // Removing raw:true returns sequelize error (I.D.K)
  async findCurrentUserForContext(userId: string) {
    return await this.Model.findByPk(userId, { include: [SecurityGroup], raw: true, nest: true });
  }

  async findUserByPhoneORUnverifiedPhone(phone: string) {
    return await this.Model.findOne({
      where: {
        [Op.or]: [
          {
            phone
          },
          {
            unverifiedPhone: phone
          }
        ]
      },
      attributes: ['id']
    });
  }

  async findAllUserDataByPhoneORUnverifiedPhone(phone: string) {
    return await this.Model.findOne({
      where: {
        [Op.or]: [
          {
            phone
          },
          {
            unverifiedPhone: phone
          }
        ]
      }
    });
  }

  async findUserByPhone(phone: string) {
    return await this.Model.findOne({
      where: {
        phone
      },
      attributes: ['id', 'status']
    });
  }

  async findUsersWithUnVerified() {
    return await this.Model.findAll({
      where: {
        unverifiedPhone: {
          [Op.ne]: null
        }
      },
      attributes: ['id']
    });
  }

  async findUserByEmail(email: string) {
    return await this.Model.findOne({
      where: {
        email
      },
      attributes: ['id']
    });
  }

  async findUserByEmailForLoginBoard(email: string) {
    return await this.Model.findOne({
      where: {
        email
      }
    });
  }

  async findUserWithMaxOtpExpiryDate(phone: string) {
    return await this.Model.findAll({
      where: {
        unverifiedPhone: phone,
        '$userVerificationCodes.useCase$': UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION
      },
      include: [
        {
          model: UserVerificationCode,
          required: true,
          attributes: ['id', 'expiryDate']
        }
      ],
      order: [[{ model: UserVerificationCode, as: 'userVerificationCodes' }, 'expiryDate', 'DESC']],
      subQuery: false,
      limit: 1,
      attributes: ['id']
    });
  }

  async findUserWithMaxOtpExpiryDateForUser(phone: string, userId: string) {
    return await this.Model.findAll({
      where: {
        unverifiedPhone: phone,
        id: {
          [Op.not]: userId
        },
        '$userVerificationCodes.useCase$': UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION
      },
      include: [
        {
          model: UserVerificationCode,
          required: true,
          attributes: ['id', 'expiryDate']
        }
      ],
      order: [[{ model: UserVerificationCode, as: 'userVerificationCodes' }, 'expiryDate', 'DESC']],
      subQuery: false,
      limit: 1,
      attributes: ['id']
    });
  }

  async removeAllUsersUnverifiedPhones(phone: string) {
    return await this.Model.update(
      { unverifiedPhone: null },
      { where: { unverifiedPhone: phone } }
    );
  }
  async createUser(input: { options?: CreateOptions; values?: Record<string, any> }) {
    return await this.Model.create(input.values, input.options);
  }

  async createUsers(models: Record<string, unknown>[]) {
    return await this.Model.bulkCreate(models);
  }

  async updateUserFromExistingModel(user: User, input = {}, transaction?: Transaction) {
    await user.update(input, { ...(transaction && { transaction }) });
    return await User.findByPk(user.id, { ...(transaction && { transaction }) });
  }

  async updateUser(where: WhereOptions, input = {}, transaction?: Transaction) {
    const res = await this.Model.update(input, {
      where,
      returning: true,
      ...(transaction && { transaction })
    });
    return res[1][0];
  }

  async updateUsers(values = {}, input: UpdateOptions) {
    return await this.Model.update(values, input);
  }

  async truncateUserModel() {
    await this.Model.truncate({ cascade: true, force: true });
  }

  async getDifferenceBetweenTwoPoints(
    firstPoint: { long: number; lat: number },
    secondPoint: { long: number; lat: number }
  ) {
    const [
      { st_distance }
    ] = await this.Model.sequelize.query(
      `select ST_Distance(ST_PointFromText('POINT(${firstPoint.long} ${firstPoint.lat})')::geography, ST_PointFromText('POINT(${secondPoint.long} ${secondPoint.lat})')::geography)`,
      { type: QueryTypes.SELECT, logging: console.log }
    );
    return st_distance;
  }

  buildDistanceFunctionForUserLocation(point: { long: number; lat: number }) {
    return Sequelize.fn(
      'ST_Distance',
      Sequelize.cast(
        Sequelize.fn('ST_SetSRID', Sequelize.fn('ST_MakePoint', point.long, point.lat), 4326),
        'geography'
      ),
      Sequelize.col('location')
    );
  }

  async getDistanceBetweenEachUserAndPoint(
    usersIds: string[],
    point: { long: number; lat: number }
  ) {
    return await this.Model.findAll({
      where: { id: usersIds },
      attributes: ['id', [this.buildDistanceFunctionForUserLocation(point), 'distance']]
    });
  }

  buildUserWhereForGetTeacher(): Record<string, any> {
    return { status: StatusEnum.ACCEPTED, role: UserRoleEnum.TEACHER };
  }

  buildUserExperienceBetweenForGetTeacher(
    minExperience: number,
    maxExperience: number
  ): Record<string, any> {
    return {
      experience: {
        [Op.between]: [minExperience, maxExperience]
      }
    };
  }

  buildUserGenderForGetTeacher(gender?: SearchByUserGenderEnum | SearchByUserGenderEnum[]) {
    return {
      gender
    };
  }

  addToUserWhereForTeacher(userWhere, obj) {
    return {
      ...userWhere,
      ...obj
    };
  }
}
