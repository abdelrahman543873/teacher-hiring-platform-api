import { StatusEnum, UserRoleEnum } from 'src/user/user.enum';
import { UserFactory } from 'src/user/user.factory';
import { rollbackDbForSchoolRegistration } from './rollback-for-school-registration';
import { post } from '../request';
import { COMPLETE_REGISTRATION_AS_SCHOOL_ADMIN } from '../graphql/school';
import { User } from 'src/user/models/user.model';
import { generateCompleteSchoolAdminRegistrationInput } from './generate-school-data';
import { SchoolFactory } from 'src/school/school.factory';
import { FileRepository } from 'src/_common/uploader/file.repository';
import { School } from 'src/school/models/school.model';

describe('Complete_school_registration_suite_case', () => {
  afterEach(async () => {
    await rollbackDbForSchoolRegistration();
  });

  it('returns_error_if_is_a_teacher', async () => {
    const user = (await UserFactory({
      paramsOnly: false,
      obj: {
        role: UserRoleEnum.TEACHER
      }
    })) as User;
    const input = await generateCompleteSchoolAdminRegistrationInput();
    const res = await post({
      query: COMPLETE_REGISTRATION_AS_SCHOOL_ADMIN,
      token: user.token,
      variables: { input }
    });
    expect(res.body.data.response.code).toBe(629);
  });

  it('returns_error_if_is_a_super_admin', async () => {
    const user = (await UserFactory({
      paramsOnly: false,
      obj: {
        role: UserRoleEnum.SUPERADMIN
      }
    })) as User;
    const input = await generateCompleteSchoolAdminRegistrationInput();
    const res = await post({
      query: COMPLETE_REGISTRATION_AS_SCHOOL_ADMIN,
      token: user.token,
      variables: { input }
    });
    expect(res.body.data.response.code).toBe(630);
  });
  it('returns_error_if_accepted_as_school_admin', async () => {
    const user = (await UserFactory({
      paramsOnly: false,
      obj: {
        role: UserRoleEnum.SCHOOLADMIN,
        status: StatusEnum.ACCEPTED
      }
    })) as User;
    const input = await generateCompleteSchoolAdminRegistrationInput();
    const res = await post({
      query: COMPLETE_REGISTRATION_AS_SCHOOL_ADMIN,
      token: user.token,
      variables: { input }
    });
    expect(res.body.data.response.code).toBe(621);
  });

  it('returns_error_if_rejected_as_school_admin', async () => {
    const user = (await UserFactory({
      paramsOnly: false,
      obj: {
        role: UserRoleEnum.SCHOOLADMIN,
        status: StatusEnum.REJECTED
      }
    })) as User;
    const input = await generateCompleteSchoolAdminRegistrationInput();
    const res = await post({
      query: COMPLETE_REGISTRATION_AS_SCHOOL_ADMIN,
      token: user.token,
      variables: { input }
    });
    expect(res.body.data.response.code).toBe(623);
  });

  it('returns_error_if_user_did_not_have_school_this_edge_case', async () => {
    const user = (await UserFactory({
      paramsOnly: false,
      obj: {
        role: UserRoleEnum.SCHOOLADMIN,
        status: StatusEnum.PENDING
      }
    })) as User;
    const input = await generateCompleteSchoolAdminRegistrationInput({ userId: user.id });
    const res = await post({
      query: COMPLETE_REGISTRATION_AS_SCHOOL_ADMIN,
      token: user.token,
      variables: { input }
    });
    expect(res.body.data.response.code).toBe(631);
  });
  it('returns_success_if_user_completed_his_data', async () => {
    const user = (await UserFactory({
      paramsOnly: false,
      obj: {
        role: UserRoleEnum.SCHOOLADMIN,
        status: StatusEnum.PENDING
      }
    })) as User;
    const school = (await SchoolFactory({
      paramsOnly: false,
      obj: {
        schoolAdminId: user.id
      }
    })) as School;
    const input = await generateCompleteSchoolAdminRegistrationInput({ userId: user.id });
    const res = await post({
      query: COMPLETE_REGISTRATION_AS_SCHOOL_ADMIN,
      token: user.token,
      variables: { input }
    });
    const {
      code,
      data: { id, role, phone, teacher, school: schoolRes, location, status }
    } = res.body.data.response;
    const {
      id: schoolId,
      schoolAdminId,
      name,
      phone: schoolPhone,
      landlineNumber,
      email: schoolEmail,
      schoolType,
      city: schoolCity,
      profilePicture: schoolProfilePic,
      grades,
      curriculums,
      gender: schoolGender,
      certificates,
      location: schoolLocation,
      createdAt: schoolCreatedAt,
      updatedAt: schoolUpdatedAt,
      arAddress: schoolArAddress,
      enAddress: schoolEnAddress
    } = schoolRes;
    expect(code).toBe(200);
    const fileRepo = new FileRepository();
    expect(code).toBe(200);
    expect(role).toBe(UserRoleEnum.SCHOOLADMIN);
    expect(phone).toBeTruthy();
    expect(status).toBe(StatusEnum.PENDING);
    expect(location).toBeTruthy();
    expect(teacher).toBeFalsy();
    expect(schoolRes).toBeTruthy();
    expect(schoolId).toBeTruthy();
    expect(schoolAdminId).toBe(id);
    expect(name).toBe(school.name);
    expect(schoolPhone).toBe(school.phone);
    expect(landlineNumber).toBe(school.landlineNumber);
    expect(schoolEmail).toBe(school.email.toLocaleLowerCase());
    expect(schoolType).toBe(school.schoolType);
    expect(schoolCity).toBe(school.city);
    expect(schoolProfilePic).toBe('/default/avatar.png');
    grades.forEach(grade => expect(input.grades).toContain(grade));
    expect(curriculums).toBeTruthy();
    curriculums.forEach(curriculum => expect(input.curriculums).toContain(curriculum.id));
    expect(schoolGender).toBe(input.gender);
    expect(certificates).toBeTruthy();
    expect(schoolLocation).toBeTruthy();
    expect(schoolCreatedAt).toBeTruthy();
    expect(schoolUpdatedAt).toBeTruthy();
    expect(schoolArAddress).toBe(input.arAddress);
    expect(schoolEnAddress).toBe(input.enAddress);
    const outPutFiles = await fileRepo.findFilesByFilter({
      id: input.certificates
    });
    expect(outPutFiles.length).toBeGreaterThan(2);
    expect(outPutFiles.length).toBe(certificates.length);
    outPutFiles.forEach(outputFile => {
      expect(outputFile.modelWhichUploadedFor).toBeTruthy();
      expect(outputFile.modelWhichUploadedFor.modelDestination).toBe('certificate');
      expect(outputFile.modelWhichUploadedFor.modelId).toBe(schoolId);
      expect(outputFile.hasReferenceAtDatabase).toBeTruthy();
      expect(certificates).toContain(outputFile.relativeDiskDestination);
    });
  });
});
