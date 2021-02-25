import { WhereOptions, Transaction, FindOptions, DestroyOptions } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { UserVerificationCode } from '../models/user-verification-code.model';
import { UserVerificationCodeUserCaseEnum } from '../user.enum';

@Injectable()
export class UserVerificationCodeRepository {
  private Model = UserVerificationCode;
  async findUserVerificationCodeByFilter(input: FindOptions) {
    return await UserVerificationCode.findOne(input);
  }

  async createOrUpdate(
    where: WhereOptions = {},
    input = {},
    transaction?: Transaction
  ): Promise<UserVerificationCode> {
    const verificationCode = await this.Model.findOne({ where });
    if (verificationCode) {
      return await verificationCode.update(input, { transaction });
    }
    return await this.Model.create(input, { transaction });
  }

  async findUserVerificationCodeByUserIdAndUseCaseAndCode({
    userId,
    useCase,
    code
  }: {
    userId: string;
    useCase: UserVerificationCodeUserCaseEnum;
    code: string;
  }) {
    return await this.Model.findOne({
      where: {
        userId,
        useCase,
        code
      }
    });
  }

  async deleteVerificationCode(input: DestroyOptions) {
    await this.Model.destroy(input);
  }

  async bulkCreate(models: Record<string, any>[]) {
    return await this.Model.bulkCreate(models);
  }

  async truncate() {
    await this.Model.truncate({ force: true });
  }

  async rawDelete() {
    await this.Model.sequelize.query(`delete from "UserVerificationCodes"`);
  }
}
