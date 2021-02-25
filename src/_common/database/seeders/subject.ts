import { SubjectsFactory } from '../../../subject/subject.factory';
export const seed = async ({ count }) => {
  return [...(await SubjectsFactory(count - 1))];
};
