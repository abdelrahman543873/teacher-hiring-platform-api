import { NotificationTypeEnum } from '../notification/notification.enum';
export const UserAccepted = {
  enBody: 'congrats you were accepted',
  arBody: 'congrats you were accepted',
  notificationType: NotificationTypeEnum.NEW_CONTACT_MESSAGE
};

export const UserRejected = {
  enBody: 'unfortunately your application was rejected contact support ',
  arBody: 'unfortunately your application was rejected contact support ',
  notificationType: NotificationTypeEnum.NEW_CONTACT_MESSAGE
};

export const UserPending = {
  enBody: 'your documents are under review',
  arBody: 'your documents are under review',
  notificationType: NotificationTypeEnum.NEW_CONTACT_MESSAGE
};
