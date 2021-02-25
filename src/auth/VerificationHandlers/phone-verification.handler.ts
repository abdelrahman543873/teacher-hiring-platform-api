import { SendPhoneVerificationCodeInput } from './../inputs/send-phone-verification-code.input';
import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { UserVerificationCode } from 'src/user/models/user-verification-code.model';
import { User } from 'src/user/models/user.model';
import { UserVerificationCodeRepository } from 'src/user/repositories/user-verification-code.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserVerificationCodeUserCaseEnum } from 'src/user/user.enum';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { GqlContext } from 'src/_common/graphql/graphql-context.type';
import { HelperService } from 'src/_common/utils/helper.service';
import { VerifyPhoneVerificationCodeInput } from '../inputs/verify-verification-code.input';
import { FOR_WHICH_TO_VALIDATE } from 'src/school/school.type';
import { UserValidator } from 'src/user/user.validator';
import { CONTEXT } from '@nestjs/graphql';

@Injectable()
export class PhoneVerificationHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userVerificationCodeRepository: UserVerificationCodeRepository,
    private readonly helperService: HelperService,
    private userValidator: UserValidator,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
    @Inject(CONTEXT) private readonly context: GqlContext
  ) {}

  async verify({ code }: VerifyPhoneVerificationCodeInput): Promise<User> {
    const { currentUser, lang } = this.context;
    if (!currentUser.unverifiedPhone) {
      throw new BaseHttpException(lang, 620);
    }

    const foundCode = await this.userVerificationCodeRepository.findUserVerificationCodeByUserIdAndUseCaseAndCode(
      {
        useCase: UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION,
        userId: currentUser.id,
        code
      }
    );

    this.verifyVerificationCode(foundCode);

    return await this.sequelize.transaction(async transaction => {
      const updatedUser = await this.userRepository.updateUser(
        {
          id: currentUser.id
        },
        {
          phone: currentUser.unverifiedPhone,
          unverifiedPhone: null
        },
        transaction
      );

      await this.userVerificationCodeRepository.deleteVerificationCode({
        where: {
          id: foundCode.id
        },
        transaction
      });

      return updatedUser;
    });
  }

  private verifyVerificationCode(verificationCode: UserVerificationCode): void {
    if (!verificationCode) {
      throw new BaseHttpException(this.context.lang, 624);
    }
    if (!this.helperService.isDateGraterThanNow(verificationCode.expiryDate)) {
      throw new BaseHttpException(this.context.lang, 625);
    }
  }

  async send(input: SendPhoneVerificationCodeInput) {
    let user = this.context.currentUser;
    const { expiryDate, code } = this.helperService.createVerificationCode();
    await this.checkPhoneNumber(input.updatedPhone);
    return await this.sequelize.transaction(async transaction => {
      if (input.updatedPhone) {
        const [_, users] = await this.userRepository.updateUsers(
          { unverifiedPhone: null },
          {
            where: {
              unverifiedPhone: input.updatedPhone
            },
            transaction,
            returning: true
          }
        );
        if (users?.length) {
          await this.userVerificationCodeRepository.deleteVerificationCode({
            where: {
              userId: users.map(({ id }) => id)
            },
            transaction
          });
        }
        user = await this.userRepository.updateUser(
          {
            id: user.id
          },
          {
            unverifiedPhone: input.updatedPhone
          },
          transaction
        );
      }
      await this.userVerificationCodeRepository.createOrUpdate(
        {
          userId: user.id,
          useCase: UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION
        },
        {
          userId: user.id,
          useCase: UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION,
          expiryDate,
          code
        },
        transaction
      );
      return user;
    });
  }

  private async checkPhoneNumber(updatedPhone?: string): Promise<void> {
    const { currentUser, lang } = this.context;
    if (updatedPhone && currentUser.phone === updatedPhone) {
      throw new BaseHttpException(lang, 619);
    }
    if (!updatedPhone && !currentUser.phone && !currentUser.unverifiedPhone) {
      throw new BaseHttpException(lang, 620);
    }

    if (!updatedPhone && !currentUser.unverifiedPhone) {
      throw new BaseHttpException(lang, 619);
    }

    if (updatedPhone) {
      await this.userValidator.checkPhoneNumber({
        phone: updatedPhone,
        type: FOR_WHICH_TO_VALIDATE.USER
      });
      await this.checkUnverifiedPhoneWithExpiredOtp(updatedPhone);
    }
  }

  async checkUnverifiedPhoneWithExpiredOtp(phone: string) {
    const { currentUser, lang } = this.context;
    const [
      userWithMaxOtpExpiredDate
    ] = await this.userRepository.findUserWithMaxOtpExpiryDateForUser(phone, currentUser.id);

    const expiryDate = userWithMaxOtpExpiredDate?.userVerificationCodes?.[0]?.expiryDate;

    if (expiryDate && this.helperService.isDateGraterThanNow(expiryDate)) {
      throw new BaseHttpException(lang, 618);
    }
  }
}
