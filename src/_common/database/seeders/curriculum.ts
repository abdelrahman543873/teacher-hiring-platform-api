import { CurriculumsFactory } from '../../../curriculum/curriculum.factory';

export const seed = async ({ count }) => {
  return [...(await CurriculumsFactory(count - 1))];
};
