import { Inject, Injectable } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { SchoolRepository } from 'src/school/school.repository';
import { FOR_WHICH_TO_VALIDATE } from 'src/school/school.type';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { GqlContext } from 'src/_common/graphql/graphql-context.type';
import { UserRepository } from './repositories/user.repository';
import { ICheckPhoneNumber } from './user.interface';

@Injectable()
export class UserValidator {
  private schoolRepository: SchoolRepository = new SchoolRepository();
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(CONTEXT) private readonly context: GqlContext
  ) {}

  async checkPhoneNumber({ phone, type }: ICheckPhoneNumber): Promise<void> {
    const error_code = type === FOR_WHICH_TO_VALIDATE.USER ? 618 : 617;

    const foundUserWithSamePhone = await this.userRepository.findUserByPhone(phone);
    if (foundUserWithSamePhone) {
      throw new BaseHttpException(this.context.lang, error_code);
    }

    const foundSchoolWithSamePhone = await this.schoolRepository.findSchoolByPhone(phone);
    if (foundSchoolWithSamePhone) {
      throw new BaseHttpException(this.context.lang, error_code);
    }
  }
}
