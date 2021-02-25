import { registerEnumType } from '@nestjs/graphql';

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}
registerEnumType(GenderEnum, { name: 'GenderEnum' });

export enum LangEnum {
  EN = 'EN',
  AR = 'AR'
}
registerEnumType(LangEnum, { name: 'LangEnum' });

export enum UserRoleEnum {
  SUPERADMIN = 'SUPERADMIN',
  TEACHER = 'TEACHER',
  SCHOOLADMIN = 'SCHOOLADMIN'
}
registerEnumType(UserRoleEnum, { name: 'UserRoleEnum' });

export enum DeviceEnum {
  DESKTOP = 'DESKTOP',
  IOS = 'IOS',
  ANDROID = 'ANDROID'
}
registerEnumType(DeviceEnum, { name: 'DeviceEnum' });

export enum UserVerificationCodeUserCaseEnum {
  PASSWORD_RESET = 'PASSWORD_RESET',
  PHONE_VERIFICATION = 'PHONE_VERIFICATION',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION'
}
registerEnumType(UserVerificationCodeUserCaseEnum, {
  name: 'UserVerificationCodeUserCaseEnum'
});

export enum StatusEnum {
  ACCEPTED = 'ACCEPTED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED'
}
registerEnumType(StatusEnum, { name: 'StatusEnum' });

export enum CitiesEnum {
  CITY1 = 'CITY1',
  CITY2 = 'CITY2'
}
registerEnumType(CitiesEnum, { name: 'CitiesEnum' });

export enum SearchByUserGenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  All = 'ALL'
}
registerEnumType(SearchByUserGenderEnum, { name: 'SearchByUserGenderEnum' });
