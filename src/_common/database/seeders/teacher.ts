import { TeachersFactory } from '../../../teacher/teacher.factory';
export const seed = async ({ count }) => {
  return [...(await TeachersFactory(count - 1))];
};
