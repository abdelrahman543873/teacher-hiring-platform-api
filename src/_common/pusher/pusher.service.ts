import firebaseAdmin, { ServiceAccount } from 'firebase-admin';
import { serviceAccount } from './pusher.config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/models/user.model';
import { LangEnum } from 'src/user/user.enum';
import {
  NotificationManagerEnum,
  NotificationTypeEnum,
  PushNotificationEnum
} from 'src/notification/notification.enum';
import {
  AllowedUserFields,
  FcmTokensAndTokensLocalized,
  NotificationPayload
} from 'src/notification/notification.type';
import { NotificationService } from 'src/notification/notification.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class PusherService implements OnModuleInit {
  private notificationService: NotificationService;

  constructor(private moduleRef: ModuleRef, private readonly configService: ConfigService) {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount as ServiceAccount),
      databaseURL: this.configService.get('FIREBASE_DB_URL')
    });
  }

  onModuleInit() {
    this.notificationService = this.moduleRef.get(NotificationService, { strict: false });
  }

  private isUserAllowedToReceiveNotificationType(
    user: User,
    notificationType: NotificationTypeEnum
  ) {
    const attached = {
      [NotificationTypeEnum.NEW_CONTACT_MESSAGE]:
        user.notificationManager[NotificationManagerEnum.WHEN_RECOMMENDATIONS]
    };

    return attached[notificationType];
  }

  private getSpecificFieldsOfUsers(user: User): AllowedUserFields {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      slug: user.slug,
      profilePicture: user.profilePicture
    };
  }

  private stringifyPayload(data: object): object {
    const newObj = {};
    Object.keys(data).map(key => {
      if (!Array.isArray(data[key])) {
        if (typeof data[key] === 'object') {
          newObj[key] = JSON.stringify(data[key]);
        } else newObj[key] = String(data[key]);
      }
    });
    return newObj;
  }

  private usersAllowedToReceiveNotifications(
    receivers: User[],
    notificationType: NotificationTypeEnum,
    fromUser?: User
  ): User[] {
    const whoReceiveNotifications = [];
    for (const receiver of receivers) {
      // Current user should not send notification to himself
      const isFromAndToUserSamePerson = fromUser ? fromUser.id === receiver.id : false;

      // `undefined` means notification type did not exist in notification manager
      if (
        receiver.notificationManager.VIA_PUSH &&
        [true, undefined].includes(
          this.isUserAllowedToReceiveNotificationType(receiver, notificationType)
        ) &&
        !isFromAndToUserSamePerson
      )
        whoReceiveNotifications.push(receiver);
    }
    return whoReceiveNotifications;
  }

  private async executeProcess(
    arabicPayload: any[] = [],
    englishPayload: any[] = [],
    tokensAndIds: FcmTokensAndTokensLocalized,
    payloadData: NotificationPayload,
    refinedFromUser: AllowedUserFields = null,
    notificationParentId: string = null
  ): Promise<void> {
    // Save chucked responses
    const messagingResponse = { EN: [], AR: [], failedTokens: [] };
    const failedTokens = [];

    // Send the arabic message
    if (arabicPayload && arabicPayload.length) {
      for (const arMsg of arabicPayload) {
        const res =
          this.configService.get('NODE_ENV') !== 'test'
            ? await firebaseAdmin.messaging().sendMulticast(arMsg)
            : jest.fn().mockReturnValue({
                responses: arMsg.tokens.map((tk: string) => ({
                  success: true,
                  messageId: `${tk}__${Math.floor(Math.random() * 100000)}`
                })),
                successCount: arMsg.tokens.length,
                failureCount: 0
              })();
        messagingResponse.AR.push(res);
        if (res.failureCount > 0) {
          res.responses.forEach((resp, idx) => {
            if (!resp.success) {
              const firstPartOfToken = tokensAndIds.AR.tokens[idx].split(':')[0];
              failedTokens.push(firstPartOfToken);
            }
          });
        }
      }
    }

    // Send the english message
    if (englishPayload && englishPayload.length) {
      for (const enMsg of englishPayload) {
        const res =
          this.configService.get('NODE_ENV') !== 'test'
            ? await firebaseAdmin.messaging().sendMulticast(enMsg)
            : jest.fn().mockReturnValue({
                responses: enMsg.tokens.map((tk: string) => ({
                  success: true,
                  messageId: `${tk}__${Math.floor(Math.random() * 100000)}`
                })),
                successCount: enMsg.tokens.length,
                failureCount: 0
              })();
        messagingResponse.EN.push(res);
        if (res.failureCount > 0) {
          res.responses.forEach((resp, idx) => {
            if (!resp.success) {
              const firstPartOfToken = tokensAndIds.EN.tokens[idx].split(':')[0];
              failedTokens.push(firstPartOfToken);
            }
          });
        }
      }
    }

    messagingResponse.failedTokens = failedTokens;

    await this.notificationService.saveNotification({
      payloadData,
      tokensAndIds,
      messagingResponse,
      notificationParentId,
      refinedFromUser
    });
  }

  private getReceiverTokensAndIds(receivers: User[]): FcmTokensAndTokensLocalized {
    return receivers.reduce(
      (total, user) => {
        const tokens = Object.values(user.fcmTokens) || [];
        if (user.fcmTokens) {
          total[user.favLang].tokens.push(...tokens.filter(t => !!t));
          total[user.favLang].ids.push({ receiverId: user.id, seen: false });
        }
        return total;
      },
      { AR: { ids: [], tokens: [] }, EN: { ids: [], tokens: [] } }
    );
  }

  private setPayload(tokens: string[], data: NotificationPayload, lang: LangEnum = LangEnum.EN) {
    const refinedData = JSON.parse(JSON.stringify(data));

    refinedData.notificationTitle = data[`${lang.toLowerCase()}Title`];
    refinedData.notificationBody = data[`${lang.toLowerCase()}Body`];
    refinedData.notificationType = data.notificationType;
    delete refinedData.enTitle;
    delete refinedData.arTitle;
    delete refinedData.enBody;
    delete refinedData.arBody;

    const chunkedMessages = [];
    for (let i = 0; i < tokens.length; i = i + 100) {
      const slicedTokens = tokens.slice(i, i + 100);
      chunkedMessages.push({
        tokens: slicedTokens,
        data: this.stringifyPayload(refinedData),
        android: {
          priority: 'high',
          ttl: 4 * 24 * 60 * 60 * 1000 // 4 days in milliseconds (number)
        },
        apns: {
          headers: {
            'apns-priority': '10',
            'apns-expiration': String(4 * 24 * 60 * 60 * 1000) // 4 days in milliseconds (string)
          },
          payload: {
            aps: {
              alert: {
                title: refinedData.notificationTitle,
                body: refinedData.notificationBody
              },
              contentAvailable: true,
              mutableContent: true,
              sound: 'default'
            }
          }
        },
        webpush: {
          headers: {
            Urgency: 'high',
            TTL: String(4 * 24 * 60 * 60) // 4 days in sec (string)
          },
          notification: {
            clickAction: data.clickAction || this.configService.get('FRONT_BASE'),
            dir: lang === LangEnum.EN ? 'ltr' : 'rtl',
            icon: `${this.configService.get('API_BASE')}/default/logo.png`,
            title: refinedData.notificationTitle,
            body: refinedData.notificationBody
          }
        }
      });
    }
    return chunkedMessages;
  }

  public async push(
    toUsers: User[] = [],
    payloadData: NotificationPayload,
    fromUser: User = null,
    notificationParentId: string = null,
    scheduledTime: Date = null
  ): Promise<{ status: string }> {
    const toUserReceivers = [];
    toUsers.map(k => {
      if (fromUser && fromUser.id !== k.id) toUserReceivers.push(k);
    });
    if (!payloadData.enTitle) payloadData.enTitle = 'Abjad';
    if (!payloadData.arTitle) payloadData.arTitle = 'Abjad';
    if (!toUsers || !toUsers.length) return { status: PushNotificationEnum.NO_USERS };
    let refinedFromUser: AllowedUserFields = null;
    if (fromUser) refinedFromUser = this.getSpecificFieldsOfUsers(fromUser);

    // Separate users to generate arabic and english payload
    const tokensAndIds = this.getReceiverTokensAndIds(toUsers);
    if (!tokensAndIds.AR.tokens.length && !tokensAndIds.EN.tokens.length)
      return { status: PushNotificationEnum.NO_FCM_TOKENS };

    let arabicPayload = null;
    let englishPayload = null;

    if (tokensAndIds.AR.tokens.length)
      arabicPayload = this.setPayload(tokensAndIds.AR.tokens, payloadData, LangEnum.AR);
    if (tokensAndIds.EN.tokens.length)
      englishPayload = this.setPayload(tokensAndIds.EN.tokens, payloadData, LangEnum.EN);

    // TODO: Scheduled notifications

    await this.executeProcess(
      arabicPayload,
      englishPayload,
      tokensAndIds,
      payloadData,
      refinedFromUser,
      notificationParentId
    );
    return {
      status: PushNotificationEnum.SUCCEED,
      ...payloadData.details
    };
  }
}
