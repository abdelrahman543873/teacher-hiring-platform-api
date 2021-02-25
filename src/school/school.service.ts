import { Inject, Injectable } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { Op, Sequelize } from 'sequelize';
import { AuthService } from 'src/auth/auth.service';
import { UserVerificationCodeRepository } from 'src/user/repositories/user-verification-code.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserVerificationCodeUserCaseEnum } from 'src/user/user.enum';
import { UserTransformer } from 'src/user/user.transformer';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { GqlContext } from 'src/_common/graphql/graphql-context.type';
import { HelperService } from 'src/_common/utils/helper.service';
import { RegisterAsSchoolInput } from './inputs/register-as-school-admin.input';
import { SchoolRepository } from './school.repository';
import { SchoolTransformer } from './school.transformer';
import { SchoolValidator } from './school.validator';
import { CompleteRegistrationAsSchool } from './inputs/complete-reg-as-school-admin';
import { FileRepository } from 'src/_common/uploader/file.repository';
import { User } from 'src/user/models/user.model';
import { CurriculumSchoolRepository } from 'src/curriculum/curriculum-school.repository';
import { ModelWhichUploadedFor } from 'src/_common/uploader/uploader.type';

@Injectable()
export class SchoolService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly schoolRepository: SchoolRepository,
    private readonly userVerificationCodeRepository: UserVerificationCodeRepository,
    private readonly helperService: HelperService,
    private readonly authService: AuthService,
    private readonly schoolValidator: SchoolValidator,
    private readonly schoolTransformer: SchoolTransformer,
    private readonly userTransformer: UserTransformer,
    private readonly fileRepository: FileRepository,
    private readonly curriculumSchoolRepository: CurriculumSchoolRepository,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
    @Inject(CONTEXT) private readonly context: GqlContext
  ) {}

  async registerAsSchoolAdmin(input: RegisterAsSchoolInput): Promise<User> {
    try {
      const { school, admin } = input;

      this.schoolValidator.validatePhoneEquality(school, admin);
      await this.schoolValidator.validateSchoolRegistrationData(school);
      await this.schoolValidator.validateSchoolAdminRegistrationData(admin);

      const lastLoginDetails = this.userTransformer.lastLoginDetailsTransformer({
        device: admin.device,
        platformDetails: admin.platformDetails
      });
      const createdAdminData = await this.schoolTransformer.transformSchoolAdminForSignUp(admin);
      const fcmTokens = this.userTransformer.fcmTokenTransformer({
        fcmToken: admin.fcmToken,
        device: admin.device
      });

      const createdSchoolAdmin = await this.sequelize.transaction(async transaction => {
        const createdAdmin = await this.userRepository.createUser({
          values: { ...createdAdminData, lastLoginDetails, fcmTokens },
          options: { transaction }
        });
        await this.schoolRepository.createSchool({
          values: { ...school, schoolAdminId: createdAdmin.id },
          options: { transaction }
        });
        // remove all users unVerifiedPhone numbers
        const [_, users] = await this.userRepository.updateUsers(
          { unverifiedPhone: null },
          {
            where: {
              unverifiedPhone: { [Op.or]: [school.phone, admin.phone] },
              id: { [Op.not]: createdAdmin.id }
            },
            transaction,
            returning: true
          }
        );
        if (users?.length) {
          // remove all otps for unVerifiedPhone numbers
          await this.userVerificationCodeRepository.deleteVerificationCode({
            where: { userId: users.map(({ id }) => id) },
            transaction
          });
        }
        const { code, expiryDate } = this.helperService.createVerificationCode();
        await this.userVerificationCodeRepository.createOrUpdate(
          { userId: createdAdmin.id, useCase: UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION },
          {
            code,
            expiryDate,
            userId: createdAdmin.id,
            useCase: UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION
          },
          transaction
        );
        return createdAdmin;
      });
      // TODO sending message
      // create token
      createdSchoolAdmin.token = this.helperService.generateAuthToken(createdSchoolAdmin.id);
      return createdSchoolAdmin;
    } catch (error) {
      throw new BaseHttpException(this.context.lang, error.status || 500, error.message);
    }
  }

  async completeRegistrationAsSchoolAdmin(input: CompleteRegistrationAsSchool): Promise<User> {
    try {
      const { currentUser } = this.context;
      if (!currentUser.phone) {
        throw new BaseHttpException(this.context.lang, 620);
      }
      await this.schoolValidator.validateCompleteSchoolRegistrationData(input);

      const [school] = await this.schoolRepository.findSchoolsByAdminId(currentUser.id);
      if (!school) {
        throw new BaseHttpException(this.context.lang, 631);
      }
      const transformedSchoolInput = await this.schoolTransformer.transformCompleteSchoolRegistration(
        input
      );

      await this.sequelize.transaction(async transaction => {
        await this.fileRepository.updateFiles(
          {
            modelWhichUploadedFor: {
              modelId: school.id,
              modelName: 'School',
              modelDestination: 'certificate'
            } as ModelWhichUploadedFor,
            hasReferenceAtDatabase: true
          },
          {
            where: {
              id: {
                [Op.in]: input.certificates
              }
            },
            transaction
          }
        );

        await this.schoolRepository.updateSchoolsByFilter(transformedSchoolInput, {
          where: {
            id: school.id
          },
          transaction
        });

        await this.curriculumSchoolRepository.destroyForSchoolId(school.id, transaction);

        await this.curriculumSchoolRepository.bulkCreate(
          this.schoolTransformer.mapEachCurriculumTOSchoolId(school.id, input.curriculums),
          { transaction }
        );
      });
      return currentUser;
    } catch (error) {
      throw new BaseHttpException(this.context.lang, error.status || 500, error.message);
    }
  }
}
