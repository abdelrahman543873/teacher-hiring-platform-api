import * as faker from 'faker';
import { CurriculumsFactory } from 'src/curriculum/curriculum.factory';
import {
  SchoolAdminRegistrationDetailsInput,
  SchoolRegistrationDetailsInput
} from 'src/school/inputs/register-as-school-admin.input';
import { SchoolGenderEnum, SchoolTypeEnum } from 'src/school/school.enum';
import { EducationalGradesEnum } from 'src/teacher/teacher.enums';
import { DeviceEnum } from 'src/user/user.enum';
import { FilesFactory } from 'src/_common/uploader/file.factory';
import { FileModelEnum } from 'src/_common/uploader/uploader.enum';
import { getValuesFromEnum } from 'src/_common/utils/columnEnum';
import { CitiesEnum } from '../../src/user/user.enum';

export function generateSchoolAdminRegistrationInput({
  school = {},
  admin = {}
}: Record<string, any>): {
  school: SchoolRegistrationDetailsInput;
  admin: SchoolAdminRegistrationDetailsInput;
} {
  return {
    school: {
      city: school.city || faker.random.arrayElement(getValuesFromEnum(CitiesEnum)),
      email: school.email || faker.internet.email(),
      phone:
        school.phone ||
        faker.phone.phoneNumber(`+20${faker.random.arrayElement([11, 12, 10])}########`),
      landlineNumber: school.landlineNumber || faker.phone.phoneNumber('+966112459###'),
      name: school.name || faker.name.title(),
      schoolType: school.schoolType || faker.random.arrayElement(getValuesFromEnum(SchoolTypeEnum))
    } as SchoolRegistrationDetailsInput,
    admin: {
      firstName: admin.firstName || faker.name.title(),
      lastName: admin.lastName || faker.name.title(),
      password: admin.password || '123456',
      phone:
        admin.phone ||
        faker.phone.phoneNumber(`+20${faker.random.arrayElement([11, 12, 10])}########`),
      device: admin.device || faker.random.arrayElement(getValuesFromEnum(DeviceEnum)),
      fcmToken: admin.fcmToken || faker.random.uuid()
    } as SchoolAdminRegistrationDetailsInput
  };
}

export async function generateCompleteSchoolAdminRegistrationInput(obj: Record<string, any> = {}) {
  const curriculumsCount = faker.random.number({ min: 1, max: 10 });
  const certificatesCount = faker.random.number({ min: 3, max: 10 });
  const createdCurriculums = await CurriculumsFactory(curriculumsCount);
  const createdCertificates = await FilesFactory(certificatesCount, {
    modelWhichUploadedFor: {
      modelName: FileModelEnum.SCHOOL
    },
    userId: obj.userId,
    hasReferenceAtDataBase: false
  });

  return {
    curriculums: obj.curriculums || createdCurriculums.map(({ id }) => id),
    certificates: obj.certificates || createdCertificates.map(({ id }) => id),
    gender: obj.gender || faker.random.arrayElement(getValuesFromEnum(SchoolGenderEnum)),
    grades: obj.grades || faker.random.arrayElements(getValuesFromEnum(EducationalGradesEnum)),
    long: obj.long || +faker.address.longitude(),
    lat: obj.lat || +faker.address.latitude(),
    arAddress: obj.arAddress || faker.address.city(),
    enAddress: obj.enAddress || faker.address.city()
  };
}
