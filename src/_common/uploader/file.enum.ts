import { registerEnumType } from '@nestjs/graphql';

export enum FileModelEnum {
  USERS = 'users',
  TEACHER = 'TEACHER',
  EXPERTISE_LEVELS = 'expertise-levels',
  DOCTOR_SCHS = 'doctor-schs',
  DOCTOR_DOCUMENT = 'doctor-document',
  PROFILE_PICTURE = 'profile-picture',
  FAMILY_MEMBER_PROFILE = 'family-member-profile',
  CONSULTATIONS_ATTACHMENTS = 'consultations-attachments'
}
registerEnumType(FileModelEnum, { name: 'FileModelEnum' });
