import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { TeacherRepository } from './teacher.repository';
import { SubjectRepository } from '../subject/subject.repository';
import { BaseHttpException } from '../_common/exceptions/base-http-exception';
import { CurriculumRepository } from '../curriculum/curriculum.repository';
import { registerAsTeacherInput } from './inputs/register-as-teacher.input';
import { UserTransformer } from '../user/user.transformer';
import { UserVerificationCodeRepository } from '../user/repositories/user-verification-code.repository';
import {
  UserVerificationCodeUserCaseEnum,
  UserRoleEnum,
  StatusEnum,
  SearchByUserGenderEnum
} from '../user/user.enum';
import { HelperService } from '../_common/utils/helper.service';
import { CompleteTeacherRegisterationInput } from './inputs/complete-teacher-registeration.input';
import { CONTEXT } from '@nestjs/graphql';
import { TeacherValidator } from './teacher.validator';
import { GqlContext } from 'src/_common/graphql/graphql-context.type';
import { Sequelize, Op } from 'sequelize';
import { FileRepository } from '../_common/uploader/file.repository';
import { ModelWhichUploadedFor } from 'src/_common/uploader/uploader.type';
import { UserRepository } from '../user/repositories/user.repository';
import { GetTeachersInput } from './inputs/teachers.input';
import { CurriculumValidator } from 'src/curriculum/curriculum.validator';
import { TeacherTransformer } from './teacher.transformer';
import { Teacher } from './models/teacher.model';
import { Subject } from 'src/subject/models/subject.model';
import { Curriculum } from 'src/curriculum/models/curriculum.model';
import { SubjectValidator } from 'src/subject/subject.validator';
import { ModuleRef } from '@nestjs/core';
import { SchoolRepository } from 'src/school/school.repository';
import { LocationType } from 'src/user/user.type';

@Injectable()
export class TeacherService {
  private schoolRepository: SchoolRepository;
  constructor(
    private readonly teacherRepo: TeacherRepository,
    private readonly curriculumRepo: CurriculumRepository,
    private readonly subjectRepo: SubjectRepository,
    private readonly userTransformer: UserTransformer,
    private readonly userVerificationCodeRepository: UserVerificationCodeRepository,
    private readonly helperService: HelperService,
    @Inject(CONTEXT) private readonly context: GqlContext,
    private readonly subjectValidator: SubjectValidator,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
    private readonly fileRepository: FileRepository,
    private readonly userRepo: UserRepository,
    private readonly curriculumValidator: CurriculumValidator,
    private readonly teacherTransformer: TeacherTransformer,
    private readonly teacherValidator: TeacherValidator,
    private readonly moduleRef: ModuleRef
  ) {
    this.schoolRepository = new SchoolRepository();
  }

  async getTeachers(input: GetTeachersInput) {
    try {
      await this.teacherValidator.validateGetTeacherInput(input);
      const { currentUser } = this.context;
      //const [userLong, userLat] = currentUser.location.coordinates;
      const teacherInclude = [];
      const userInclude = [];
      const userAttributes: Record<string, any> = {};
      const userWhere: Record<string, any> = {
        status: StatusEnum.ACCEPTED,
        role: UserRoleEnum.TEACHER
      };
      const userOrder = [];
      const teacherWhere: Record<string, any> = {};
      let schoolLocation: LocationType;

      if (input?.filterBy?.subjects?.length) {
        teacherInclude.push({
          model: Subject,
          where: {
            id: {
              [Op.in]: input.filterBy.subjects
            }
          },
          attributes: ['id']
        });
      }
      if (input?.filterBy?.curriculums?.length) {
        teacherInclude.push({
          model: Curriculum,
          where: {
            id: {
              [Op.in]: input.filterBy.curriculums
            }
          },
          attributes: ['id']
        });
      }
      if (![undefined, null].includes(input?.filterBy?.rating)) {
        teacherWhere.avgRate = {
          [Op.gte]: input.filterBy.rating
        };
      }
      if (input?.filterBy?.gender) {
        if (input.filterBy.gender === SearchByUserGenderEnum.All) {
          userWhere.gender = [SearchByUserGenderEnum.FEMALE, SearchByUserGenderEnum.MALE];
        } else {
          userWhere.gender = input.filterBy.gender;
        }
      }
      if (input?.filterBy?.maxExperience && input?.filterBy?.minExperience) {
        teacherWhere.experience = {
          [Op.between]: [input.filterBy.minExperience, input.filterBy.maxExperience]
        };
      } else if (input?.filterBy?.maxExperience) {
        teacherWhere.experience = {
          [Op.lte]: input.filterBy.maxExperience
        };
      } else if (input?.filterBy?.minExperience) {
        teacherWhere.experience = {
          [Op.gte]: input.filterBy.minExperience
        };
      }
      if (input?.filterBy?.grades?.length) {
        teacherWhere.grades = {
          [Op.contains]: input.filterBy.grades
        };
      }
      if (input?.searchKey) {
        userWhere.$or = [
          {
            firstName: {
              [Op.iLike]: `%${input.searchKey}%`
            }
          },
          {
            lastName: {
              [Op.iLike]: `%${input.searchKey}%`
            }
          }
        ];
      }
      // if provided max_distance and point the starting point is the point provided
      if (input?.filterBy?.max_distance && input?.lat && input?.long) {
        userWhere.maxDistance = Sequelize.where(
          this.userRepo.buildDistanceFunctionForUserLocation({ long: input.long, lat: input.lat }),
          {
            [Op.lte]: input.filterBy.max_distance * 1000
          }
        );
      } else if (input?.filterBy?.max_distance) {
        //the starting point is the school location
        if (!schoolLocation) {
          schoolLocation = await (
            await this.schoolRepository.findSchoolLocationByAdminId(currentUser.id)
          ).location;
        }
        const [long, lat] = schoolLocation.coordinates;
        userWhere.maxDistance = Sequelize.where(
          this.userRepo.buildDistanceFunctionForUserLocation({ long, lat }),
          {
            [Op.lte]: input.filterBy.max_distance * 1000
          }
        );
      }
      // provided point has higher priority ove user location if provided
      if (input.lat && input.long) {
        const distanceFunction = this.userRepo.buildDistanceFunctionForUserLocation({
          long: input.long,
          lat: input.lat
        });
        userOrder.push([distanceFunction, 'ASC']);
        // add distance attribute to compute the difference between user location and provided point
        userAttributes.include = [[distanceFunction, 'distance']];
      } else {
        // add distance attribute to compute the difference between users location and current users school location
        if (!schoolLocation) {
          schoolLocation = (await this.schoolRepository.findSchoolLocationByAdminId(currentUser.id))
            .location;
        }
        const [long, lat] = schoolLocation.coordinates;
        const distanceFunction = this.userRepo.buildDistanceFunctionForUserLocation({
          long,
          lat
        });
        userOrder.push([distanceFunction, 'ASC']);
        userAttributes.include = [[distanceFunction, 'distance']];
      }
      if (
        input?.filterBy?.subjects?.length ||
        input?.filterBy?.curriculums?.length ||
        input?.filterBy?.maxExperience ||
        input?.filterBy?.minExperience ||
        input?.filterBy?.rating
      ) {
        userInclude.push({
          model: Teacher,
          required: true,
          where: teacherWhere,
          include: teacherInclude,
          attributes: ['teacherId']
        });
      }
      return await this.userRepo.findPaginatedUsersByFilter(
        userWhere,
        userOrder,
        userAttributes,
        input?.page,
        input?.limit
      );
    } catch (error) {
      throw new BaseHttpException(this.context.lang, error.status || 500, error.message);
    }
  }

  async registerAsTeacher(teacherInput: registerAsTeacherInput) {
    const user = await this.teacherRepo.findExistingTeacher(teacherInput);
    const school = await this.teacherRepo.findExistingSchool(teacherInput);
    if (user && user.email === teacherInput.email.toLowerCase())
      throw new BaseHttpException('EN', 601);
    if (user && user.phone === teacherInput.unverifiedPhone) throw new BaseHttpException('EN', 602);
    if (school && school.phone === teacherInput.unverifiedPhone)
      throw new BaseHttpException('EN', 602);
    if (school && school.email === teacherInput.email.toLowerCase())
      throw new BaseHttpException('EN', 601);
    const fcmTokens = this.userTransformer.fcmTokenTransformer({
      fcmToken: teacherInput.fcmToken,
      device: teacherInput.device
    });
    teacherInput['lastLoginDetails'] = this.userTransformer.lastLoginDetailsTransformer({
      device: teacherInput.device,
      platformDetails: teacherInput.platformDetails
    });
    teacherInput.password = await this.helperService.hashPassword(teacherInput.password);
    const createdUser = await this.userRepo.createUser({
      values: { ...teacherInput, fcmTokens, role: UserRoleEnum.TEACHER }
    });
    const { code, expiryDate } = this.helperService.createVerificationCode();
    await this.userVerificationCodeRepository.createOrUpdate(
      { userId: createdUser.id, useCase: UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION },
      {
        code,
        expiryDate,
        userId: createdUser.id,
        useCase: UserVerificationCodeUserCaseEnum.PHONE_VERIFICATION
      }
    );
    createdUser.token = this.helperService.generateAuthToken(createdUser.id);
    return createdUser;
  }

  async completeTeacherProfile(completeTeacher: CompleteTeacherRegisterationInput) {
    const { currentUser } = this.context;
    const user = await this.userRepo.findCurrentUserForContext(currentUser.id);
    if (!user) throw new BaseHttpException(this.context.lang, 606);
    if (!user.phone) throw new BaseHttpException(this.context.lang, 605);
    const teacher = await this.teacherRepo.findTeacher(currentUser.id);
    if (teacher) throw new BaseHttpException(this.context.lang, 648);

    await this.curriculumValidator.validateCurriculumCount(completeTeacher.curriculums);
    await this.subjectValidator.validateSubjectCount(completeTeacher.subjects);

    try {
      return await this.sequelize.transaction(async transaction => {
        ['cv', 'idDocument'].forEach(async doc => {
          await this.fileRepository.updateFiles(
            {
              modelWhichUploadedFor: {
                modelId: currentUser.id,
                modelName: 'Teacher',
                modelDestination: doc
              } as ModelWhichUploadedFor,
              hasReferenceAtDatabase: true
            },
            {
              where: {
                id: completeTeacher[doc]
              },
              transaction
            }
          );
        });
        await this.fileRepository.updateFiles(
          {
            modelWhichUploadedFor: {
              modelId: currentUser.id,
              modelName: 'Teacher',
              modelDestination: 'certificates'
            } as ModelWhichUploadedFor,
            hasReferenceAtDatabase: true
          },
          {
            where: {
              id: { [Op.in]: completeTeacher.certificates }
            },
            transaction
          }
        );
        const teacher = await this.teacherRepo.createTeacher(
          currentUser.id,
          completeTeacher,
          transaction
        );
        const teacherCurriculums = this.teacherTransformer.mapEachCurriculumIdToTeacherId(
          currentUser.id,
          completeTeacher.curriculums
        );
        const teacherSubjects = this.teacherTransformer.mapEachSubjectIdToTeacherId(
          currentUser.id,
          completeTeacher.subjects
        );
        await this.teacherRepo.createTeacherCurriculums(teacherCurriculums, transaction);
        await this.teacherRepo.createTeacherSubject(teacherSubjects, transaction);
        return teacher;
      });
    } catch (error) {
      throw new BaseHttpException(this.context.lang, error.status || 500, error.message);
    }
  }

  async chooseTeacherSubject(teacherId: string, subjectId: string) {
    const teacher = this.teacherRepo.findTeacher(teacherId);
    const subject = this.subjectRepo.findSubject(subjectId);
    if (!teacher) {
      throw new BaseHttpException(this.context.lang, 644);
    } else if (!subject) {
      throw new BaseHttpException(this.context.lang, 645);
    }
    return await this.teacherRepo.chooseTeacherSubject(teacherId, subjectId);
  }

  async chooseTeacherCurriculum(teacherId: string, curriculumId: string) {
    const teacher = this.teacherRepo.findTeacher(teacherId);
    const curriculum = this.curriculumRepo.findCurriculumByID(curriculumId);
    if (!teacher) {
      throw new BaseHttpException(this.context.lang, 644);
    } else if (!curriculum) {
      throw new BaseHttpException(this.context.lang, 646);
    }
    return await this.teacherRepo.chooseTeacherCurriculum(teacherId, curriculumId);
  }
}
