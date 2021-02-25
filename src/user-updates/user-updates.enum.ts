import { registerEnumType } from '@nestjs/graphql';

export enum TeacherOrSchoolAdminEnum {
  TEACHER = 'TEACHER',
  SCHOOLADMIN = 'SCHOOLADMIN'
}
registerEnumType(TeacherOrSchoolAdminEnum, { name: 'TeacherOrSchoolAdminEnum' });
