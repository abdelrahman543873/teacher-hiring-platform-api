import { Inject, Injectable } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { CurriculumRepository } from 'src/curriculum/curriculum.repository';
import { CurriculumValidator } from 'src/curriculum/curriculum.validator';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserValidator } from 'src/user/user.validator';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { GqlContext } from 'src/_common/graphql/graphql-context.type';
import { FileRepository } from 'src/_common/uploader/file.repository';
import { FileModelEnum } from 'src/_common/uploader/uploader.enum';
import { HelperService } from '../_common/utils/helper.service';
import { CompleteRegistrationAsSchool } from './inputs/complete-reg-as-school-admin';

import {
  SchoolRegistrationDetailsInput,
  SchoolAdminRegistrationDetailsInput
} from './inputs/register-as-school-admin.input';
import { SchoolRepository } from './school.repository';
import { FOR_WHICH_TO_VALIDATE } from './school.type';

@Injectable()
export class SchoolValidator {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly schoolRepository: SchoolRepository,
    private readonly helperService: HelperService,
    private readonly userValidator: UserValidator,
    private readonly fileRepository: FileRepository,
    @Inject(CONTEXT) private readonly context: GqlContext,
    private readonly curriculumValidator: CurriculumValidator
  ) {}
  validatePhoneEquality(
    school: SchoolRegistrationDetailsInput,
    admin: SchoolAdminRegistrationDetailsInput
  ): void {
    if (school.phone === admin.phone) {
      throw new BaseHttpException(this.context.lang, 615);
    }
  }

  async validateSchoolAdminRegistrationData(
    admin: SchoolAdminRegistrationDetailsInput
  ): Promise<void> {
    await this.userValidator.checkPhoneNumber({
      phone: admin.phone,
      type: FOR_WHICH_TO_VALIDATE.USER
    });
    await this.checkUnverifiedPhoneWithExpiredOtp(admin.phone, FOR_WHICH_TO_VALIDATE.USER);
  }

  async validateSchoolRegistrationData(school: SchoolRegistrationDetailsInput): Promise<void> {
    const foundSameSchoolName = await this.schoolRepository.findSchoolByName(school.name);
    if (foundSameSchoolName) {
      throw new BaseHttpException(this.context.lang, 613);
    }
    const foundSameSchoolEmail = await this.schoolRepository.findSchoolByEmail(
      school.email.toLocaleLowerCase()
    );
    if (foundSameSchoolEmail) {
      throw new BaseHttpException(this.context.lang, 616);
    }
    const foundSameUserEmail = await this.userRepository.findUserByEmail(
      school.email.toLocaleLowerCase()
    );
    if (foundSameUserEmail) {
      throw new BaseHttpException(this.context.lang, 616);
    }

    const foundSameSchoolLandLine = await this.schoolRepository.findSchoolByLandlineNumber(
      school.landlineNumber
    );
    if (foundSameSchoolLandLine) {
      throw new BaseHttpException(this.context.lang, 614);
    }
    //check phone number
    await this.userValidator.checkPhoneNumber({
      phone: school.phone,
      type: FOR_WHICH_TO_VALIDATE.SCHOOL
    });
    await this.checkUnverifiedPhoneWithExpiredOtp(school.phone, FOR_WHICH_TO_VALIDATE.SCHOOL);
  }

  async checkUnverifiedPhoneWithExpiredOtp(phone: string, type: FOR_WHICH_TO_VALIDATE) {
    const error_code = type === FOR_WHICH_TO_VALIDATE.USER ? 618 : 617;
    const [userWithMaxOtpExpiredDate] = await this.userRepository.findUserWithMaxOtpExpiryDate(
      phone
    );

    const expiryDate = userWithMaxOtpExpiredDate?.userVerificationCodes?.[0]?.expiryDate;

    if (expiryDate && this.helperService.isDateGraterThanNow(expiryDate)) {
      throw new BaseHttpException(this.context.lang, error_code);
    }
  }

  async validateCompleteSchoolRegistrationData(input: CompleteRegistrationAsSchool): Promise<void> {
    //validate curriculums
    await this.curriculumValidator.validateCurriculumCount(input.curriculums);
    // validate certificates
    const fileCount = await this.fileRepository.countFilesByIdAndNameAndReferenceAndUploder({
      ids: input.certificates,
      modelName: FileModelEnum.SCHOOL,
      hasReferenceAtDatabase: false,
      uploadedById: this.context.currentUser.id
    });
    if (fileCount !== input.certificates.length) {
      throw new BaseHttpException(this.context.lang, 626);
    }
  }
}
