import * as faker from 'faker';
import { Curriculum } from './models/curriculum.model';

type CurriculumType = {
  enName: string;
  arName: string;
  enDescription: string;
  arDescription: string;
};

export const buildCurriculumParams = (obj = <any>{}): CurriculumType => {
  return {
    enName: obj.enName || faker.name.findName(),
    arName: obj.arName || faker.name.findName(),
    enDescription: obj.enDescription || faker.commerce.productDescription(),
    arDescription: obj.arDescription || faker.commerce.productDescription()
  };
};

export const CurriculumsFactory = async (count = 10, obj = <any>{}): Promise<Curriculum[]> => {
  const curriculums = [];
  for (let i = 0; i < count; i++) {
    curriculums.push(buildCurriculumParams(obj));
  }
  return await Curriculum.bulkCreate(curriculums);
};

export const CurriculumFactory = async (obj = <any>{}): Promise<Curriculum> => {
  const params = buildCurriculumParams(obj);
  return await Curriculum.create(params);
};
