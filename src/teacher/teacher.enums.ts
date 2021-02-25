import { registerEnumType } from '@nestjs/graphql';
export enum EducationalGradesEnum {
  KINDERGARTEN = 'KINDERGARTEN',
  PRIMARY = 'PRIMARY',
  INTERMEDIATE = 'INTERMEDIATE',
  SECONDARY = 'SECONDARY'
}
registerEnumType(EducationalGradesEnum, { name: 'EducationalGradesEnum' });

export enum EducationalCurriculumsEnum {
  AMERICAN = 'AMERICAN',
  ARABIC = 'ARABIC',
  AUSTRALIAN = 'AUSTRALIAN',
  BRITISH = 'BRITISH',
  CBSE = 'CBSE',
  IB = 'IB',
  IGCSE = 'IGCSE',
  ISLAMIC = 'ISLAMIC',
  SABIS = 'SABIS',
  UKEYES = 'UK EYES'
}
registerEnumType(EducationalCurriculumsEnum, { name: 'EducationalCurriculumsEnum' });

export enum TeacherAttachmentsTypeEnum {
  CV = 'CV',
  ID = 'ID',
  CERTIFICATE = 'CERTIFICATE'
}

registerEnumType(TeacherAttachmentsTypeEnum, { name: 'TeacherAttachmentsTypeEnum' });


