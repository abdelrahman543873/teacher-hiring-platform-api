import * as faker from 'faker';
import { Teacher } from './models/teacher.model';
import { UsersFactory, UserFactory } from '../user/user.factory';
import { TeacherSubject } from '../subject/models/teacher-subject.model';
import { SubjectsFactory } from '../subject/subject.factory';
import { CurriculumsFactory } from '../curriculum/curriculum.factory';
import { TeacherCurriculum } from '../curriculum/models/teacher-curriculum.model';
import { EducationalGradesEnum } from './teacher.enums';
import { getValuesFromEnum } from '../_common/utils/columnEnum';
import { GenderEnum, CitiesEnum, LangEnum, UserRoleEnum, DeviceEnum } from '../user/user.enum';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/models/user.model';
import { FilesFactory } from 'src/_common/uploader/file.factory';
import { FileModelEnum } from '../_common/uploader/file.enum';
type TeacherType = {
  teacherId: string;
  subjects: string[];
  curriculums: string[];
  experience: number;
  grades: EducationalGradesEnum[];
  cv: string;
  idDocument: string;
  certificates: string[];
  arAddress: string;
  enAddress: string;
};

type RegisterTeacherType = {
  firstName: string;
  lastName: string;
  gender: GenderEnum;
  password: string;
  unverifiedPhone: string;
  city: CitiesEnum;
  email: string;
  favLang: LangEnum;
  device: DeviceEnum;
};
const isNullORValue = val => val === null || val;

export const buildTeacherParams = async (obj = <any>{}): Promise<TeacherType> => {
  const subjects = (await SubjectsFactory(3)).map(subject => subject.id);
  const curriculums = (await CurriculumsFactory(3)).map(curriculum => curriculum.id);
  const certificates = (
    await FilesFactory(3, {
      modelWhichUploadedFor: {
        modelName: FileModelEnum.TEACHER
      },
      userId: obj.userId,
      hasReferenceAtDataBase: false
    })
  ).map(file => file.id);
  return {
    teacherId: obj.teacherId || ((await UserFactory({})) as User).id,
    cv: obj.cv || certificates[0],
    idDocument: obj.idDocument || certificates[1],
    certificates: obj.certificates || certificates,
    subjects: obj.subjects || subjects,
    curriculums: obj.curriculums || curriculums,
    grades: obj.grades || faker.random.arrayElements(getValuesFromEnum(EducationalGradesEnum)),
    experience: obj.experience || faker.random.number(),
    enAddress: obj.enAddress || faker.address.streetName(),
    arAddress: obj.enAddress || faker.address.streetName()
  };
};

export const buildRegisterTeacherParams = (obj = <any>{}): RegisterTeacherType => {
  const firstName = obj.firstName || faker.name.findName();
  return {
    firstName,
    lastName: obj.lastName || faker.name.findName(),
    gender: obj.gender || faker.random.arrayElement(getValuesFromEnum(GenderEnum)),
    password: obj.password ? bcrypt.hashSync(obj.password, 12) : bcrypt.hashSync('123456', 12),
    unverifiedPhone: isNullORValue(obj.unverifiedPhone)
      ? obj.unverifiedPhone
      : faker.phone.phoneNumber(`+20${faker.random.arrayElement([11, 12, 10])}########`),
    city: obj.city || faker.random.arrayElement(getValuesFromEnum(CitiesEnum)),
    email: obj.email || faker.internet.email(),
    favLang: obj.favLang || faker.random.arrayElement(getValuesFromEnum(LangEnum)),
    device: obj.device || faker.random.arrayElement(getValuesFromEnum(DeviceEnum))
  };
};

export const TeachersFactory = async (
  count = 10,
  obj: Record<string, any> = {}
): Promise<Teacher[]> => {
  const params = await buildTeacherParams(obj);
  const users = (await UsersFactory(count)).map(user => {
    return { ...{ teacherId: user.id, ...params } };
  });
  const teacheres = await Teacher.bulkCreate(users);
  const subjects = (await SubjectsFactory(count)).map((subject, index) => {
    return { subjectId: subject.id, teacherId: users[index].teacherId };
  });
  await TeacherSubject.bulkCreate(subjects);
  const curriculums = (await CurriculumsFactory(count)).map((curriculum, index) => {
    return { curriculumId: curriculum.id, teacherId: users[index].teacherId };
  });
  await TeacherCurriculum.bulkCreate(curriculums);
  return teacheres;
};

export const TeacherFactory = async (obj = <any>{}): Promise<Teacher> => {
  const params = await buildTeacherParams(obj);
  return await Teacher.create(params);
};

export const RegisterTeacherFactory = async (obj = <any>{}): Promise<User> => {
  const params = buildRegisterTeacherParams(obj);
  return await User.create({ ...params, role: UserRoleEnum.TEACHER });
};
