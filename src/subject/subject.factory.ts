import * as faker from 'faker';
import { Subject } from './models/subject.model';

type SubjectType = {
  enName: string;
  arName: string;
  enDescription: string;
  arDescription: string;
};

export const buildSubjectParams = (obj = <any>{}): SubjectType => {
  return {
    enName: obj.enName || faker.name.findName(),
    arName: obj.enName || faker.name.findName(),
    enDescription: obj.enName || faker.commerce.productDescription(),
    arDescription: obj.enName || faker.commerce.productDescription()
  };
};

export const SubjectsFactory = async (count = 10, obj = <any>{}): Promise<Subject[]> => {
  const subjects = [];
  for (let i = 0; i < count; i++) {
    subjects.push(buildSubjectParams(obj));
  }
  return await Subject.bulkCreate(subjects);
};

export const SubjectFactory = async (obj = <any>{}): Promise<Subject> => {
  const params = buildSubjectParams(obj);
  return await Subject.create(params);
};
