import { SchoolsFactory } from 'src/school/school.factory';

export const seed = async ({ count }) => {
  return [...(await SchoolsFactory(count - 1))];
};
