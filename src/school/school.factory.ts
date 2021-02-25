import * as faker from 'faker';
import { EducationalCurriculumsEnum, EducationalGradesEnum } from 'src/teacher/teacher.enums';
import { CitiesEnum } from 'src/user/user.enum';
import { LocationType } from 'src/user/user.type';
import { getValuesFromEnum } from 'src/_common/utils/columnEnum';
import { SchoolGenderEnum, SchoolTypeEnum } from './school.enum';
import { SchoolRepository } from './school.repository';
import { SchoolAttachment } from './school.type';

const schoolRepository = new SchoolRepository();

type SchoolType = {
  schoolAdminId: string;
  name: string;
  phone: string;
  landlineNumber: string;
  email: string;
  schoolType: SchoolTypeEnum;
  city: CitiesEnum;
  profilePicture?: string;
  grades?: EducationalGradesEnum[];
  curriculums?: EducationalCurriculumsEnum[];
  gender?: SchoolGenderEnum;
  attachments?: SchoolAttachment[];
  location?: LocationType;
  arAddress?: string;
  enAddress?: string;
};

function buildParams(obj: Record<string, any> = {}): SchoolType {
  return {
    schoolAdminId: obj.schoolAdminId,
    name: obj.name || faker.name.title(),
    email: obj.email || faker.internet.email(),
    phone:
      obj.phone || faker.phone.phoneNumber(`+20${faker.random.arrayElement([11, 12, 10])}########`),
    landlineNumber: obj.landlineNumber || faker.phone.phoneNumber('+966112459###'),
    city: obj.city || faker.random.arrayElement(getValuesFromEnum(CitiesEnum)),
    schoolType: obj.schoolType || faker.random.arrayElement(getValuesFromEnum(SchoolTypeEnum)),
    grades: obj.grades || faker.random.arrayElements(getValuesFromEnum(EducationalGradesEnum)),
    curriculums:
      obj.curriculums || faker.random.arrayElements(getValuesFromEnum(EducationalCurriculumsEnum)),
    gender: obj.gender || faker.random.arrayElement(getValuesFromEnum(SchoolGenderEnum)),
    arAddress: obj.arAddress || faker.address.city(),
    enAddress: obj.enAddress || faker.address.city(),
    location: obj.location || {
      type: 'Point',
      coordinates: [faker.address.longitude, faker.address.latitude]
    }
  };
}

export async function SchoolsFactory(
  count = 10,
  obj: Record<string, any> = { schoolAdminsIds: [] }
) {
  const schools = [];
  for (let i = 0; i < count; i++) {
    if (obj.schoolAdminsIds && !obj.schoolAdminId) {
      obj.schoolAdminId = faker.random.arrayElement[obj.schoolAdminsIds];
    }
    schools.push(buildParams(obj));
  }
  return await schoolRepository.createSchools(schools);
}

export async function SchoolFactory({ paramsOnly = false, obj = <Record<string, any>>{} }) {
  const params = buildParams(obj);
  if (paramsOnly) return params;
  return await schoolRepository.createSchool({ values: params });
}
