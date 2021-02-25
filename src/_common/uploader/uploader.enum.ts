import { registerEnumType } from '@nestjs/graphql';

export enum FileModelEnum {
  TEACHER = 'teachers',
  SCHOOL = 'schools',
  USER = 'users'
}
registerEnumType(FileModelEnum, { name: 'FileModelEnum' });
