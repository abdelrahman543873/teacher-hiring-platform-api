import { FOR_WHICH_TO_VALIDATE } from 'src/school/school.type';
import { GqlContext } from 'src/_common/graphql/graphql-context.type';
import { DeviceEnum } from './user.enum';

export interface LastLoginDetailsTransformerInput {
  device: DeviceEnum;
  platformDetails?: Record<string, any>;
}

export interface LastLoginDetails {
  lastLoginAt: Date;
  lastLoginDevice: DeviceEnum;
  platformDetails?: Record<string, any>;
}

export interface fcmTokenInput {
  fcmToken?: string;
  device: DeviceEnum;
}

export type FcmTokensType = {
  [k in DeviceEnum]: string | null;
};

export interface ICheckPhoneNumber {
  phone: string;
  type: FOR_WHICH_TO_VALIDATE;
}
