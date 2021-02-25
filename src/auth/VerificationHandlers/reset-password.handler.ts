import { Inject, Injectable } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { Sequelize } from 'sequelize';
import { UserVerificationCode } from 'src/user/models/user-verification-code.model';
import { User } from 'src/user/models/user.model';
import { UserVerificationCodeRepository } from 'src/user/repositories/user-verification-code.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import { StatusEnum, UserVerificationCodeUserCaseEnum } from 'src/user/user.enum';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { GqlContext } from 'src/_common/graphql/graphql-context.type';
import { HelperService } from 'src/_common/utils/helper.service';
import { ResetPasswordByPhoneInput } from '../inputs/reset-password-by-phone.input';
import { VerifyResetPasswordVerificationCode } from '../inputs/verify-reset-password-code.input';

@Injectable()
export class ResetPasswordHandler {
  constructor(
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
    @Inject(CONTEXT) private readonly context: GqlContext,
    private userRepository: UserRepository,
    private helperService: HelperService,
    private userVerificationCodeRepository: UserVerificationCodeRepository
  ) {}

  async send(phone: string) {
    const user = await this.userRepository.findUserByPhone(phone);
    if (!user) return true;
    if (user.status === StatusEnum.REJECTED) return true;

    const { expiryDate, code } = this.helperService.createVerificationCode();

    return await this.sequelize.transaction(async transaction => {
      await this.userVerificationCodeRepository.createOrUpdate(
        {
          userId: user.id,
          useCase: UserVerificationCodeUserCaseEnum.PASSWORD_RESET
        },
        {
          userId: user.id,
          useCase: UserVerificationCodeUserCaseEnum.PASSWORD_RESET,
          expiryDate,
          code
        },
        transaction
      );

      return true;
    });
  }

  async verify(input: ResetPasswordByPhoneInput | VerifyResetPasswordVerificationCode) {
    const user = await this.userRepository.findUserByPhone(input.phone);
    if (!user) throw new BaseHttpException(this.context.lang, 606);
    if (user.status === StatusEnum.REJECTED) throw new BaseHttpException(this.context.lang, 606);
    //other checks
    const foundCode = await this.userVerificationCodeRepository.findUserVerificationCodeByUserIdAndUseCaseAndCode(
      {
        useCase: UserVerificationCodeUserCaseEnum.PASSWORD_RESET,
        code: input.code,
        userId: user.id
      }
    );
    if (!foundCode) {
      throw new BaseHttpException(this.context.lang, 624);
    }
    if (!this.helperService.isDateGraterThanNow(foundCode.expiryDate)) {
      throw new BaseHttpException(this.context.lang, 625);
    }
    return { user, code: foundCode };
  }

  async reset({
    user,
    code,
    newPassword
  }: {
    user: User;
    code: UserVerificationCode;
    newPassword: string;
  }) {
    return await this.sequelize.transaction(async transaction => {
      const updatedUser = await this.userRepository.updateUser(
        {
          id: user.id
        },
        {
          password: await this.helperService.hashPassword(newPassword)
        },
        transaction
      );

      await this.userVerificationCodeRepository.deleteVerificationCode({
        where: {
          id: code.id
        },
        transaction
      });

      return updatedUser;
    });
  }
}
