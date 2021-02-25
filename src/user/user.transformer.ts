import { Injectable } from '@nestjs/common';
import { DeviceEnum } from './user.enum';
import {
  fcmTokenInput,
  FcmTokensType,
  LastLoginDetails,
  LastLoginDetailsTransformerInput
} from './user.interface';

@Injectable()
export class UserTransformer {
  public lastLoginDetailsTransformer(input: LastLoginDetailsTransformerInput): LastLoginDetails {
    return {
      lastLoginAt: new Date(),
      ...(input.device && { lastLoginDevice: input.device }),
      ...(input.platformDetails && { platformDetails: input.platformDetails })
    };
  }

  public fcmTokenTransformer(input: fcmTokenInput): FcmTokensType {
    const fcmTokenObject = {
      [DeviceEnum.ANDROID]: null,
      [DeviceEnum.DESKTOP]: null,
      [DeviceEnum.IOS]: null
    } as FcmTokensType;
    if (input.fcmToken) {
      fcmTokenObject[input.device] = input.fcmToken;
    }
    return fcmTokenObject;
  }
}
