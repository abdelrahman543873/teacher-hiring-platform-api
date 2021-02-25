import { registerEnumType } from '@nestjs/graphql';

export enum PushNotificationEnum {
  SUCCEED = 'SUCCEED',
  NO_USERS = 'NO_USERS',
  NO_FCM_TOKENS = 'NO_FCM_TOKENS'
}

export enum NotificationTypeEnum {
  NEW_CONTACT_MESSAGE = 'NEW_CONTACT_MESSAGE'
}
registerEnumType(NotificationTypeEnum, { name: 'NotificationTypeEnum' });

export enum NotificationManagerEnum {
  VIA_EMAIL = 'VIA_EMAIL',
  VIA_PUSH = 'VIA_PUSH',
  WHEN_RECOMMENDATIONS = 'WHEN_RECOMMENDATIONS'
}
registerEnumType(NotificationManagerEnum, { name: 'NotificationManagerEnum' });
