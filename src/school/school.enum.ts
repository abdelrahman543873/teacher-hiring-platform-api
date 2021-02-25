import { registerEnumType } from '@nestjs/graphql';
import { StatusEnum } from '../user/user.enum';

export enum SchoolTypeEnum {
  PRIVATE = 'PRIVATE',
  INTERNATIONAL = 'INTERNATIONAL',
  GOVERNMENT = 'GOVERNMENT'
}
registerEnumType(SchoolTypeEnum, { name: 'SchoolTypeEnum' });

export enum SchoolAttachmentTypeEnum {
  CERTIFICATE = 'CERTIFICATE'
}
registerEnumType(SchoolAttachmentTypeEnum, { name: 'SchoolAttachmentTypeEnum' });

export enum SchoolGenderEnum {
  ALLBOYS = 'ALLBOYS',
  ALLGIRLS = 'ALLGIRLS',
  MIXED = 'MIXED'
}
registerEnumType(SchoolGenderEnum, { name: 'SchoolGenderEnum' });

export enum Status {
  ALLBOYS = 'ALLBOYS',
  ALLGIRLS = 'ALLGIRLS',
  MIXED = 'MIXED'
}
registerEnumType(SchoolGenderEnum, { name: 'SchoolGenderEnum' });
