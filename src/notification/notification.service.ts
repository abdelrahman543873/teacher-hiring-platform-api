import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/models/user.model';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationUserStatusRepository } from './repositories/notification-user-status.repository';
import { SendNotificationInput } from './inputs/send-notification.input';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { FilterNotificationsInput } from './inputs/filter-notifications.input';
import { PaginatorInput } from 'src/_common/paginator/paginator.input';
import { SetNotificationsInSeenStatusInput } from './inputs/set-notifications-in-seen-status.input';
import { ManageMyNotificationsInput } from './inputs/manage-my-notifications.input';
import { UserRepository } from 'src/user/repositories/user.repository';
import { PusherService } from 'src/_common/pusher/pusher.service';
import { Op } from 'sequelize';
import { CONTEXT } from '@nestjs/graphql';
import { GqlContext } from 'src/_common/graphql/graphql-context.type';
import { NotificationTypeReturnedToUser, SaveNotificationForPusher } from './notification.type';
import { Sequelize } from 'sequelize';
import { Notification } from './models/notification.model';
import { PinoLogger } from 'nestjs-pino';
import { SortEnum } from 'src/_common/graphql/graphql.enum';

@Injectable()
export class NotificationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly notificationRepo: NotificationRepository,
    private readonly notificationUserStatusRepo: NotificationUserStatusRepository,
    private readonly pusherService: PusherService,
    private readonly userRepo: UserRepository,
    private readonly logger: PinoLogger,
    @Inject(CONTEXT) private readonly context: GqlContext,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize
  ) {}

  async saveNotification(input: SaveNotificationForPusher): Promise<Notification> {
    try {
      return await this.sequelize.transaction(async transaction => {
        const notification = await this.notificationRepo.createNotification(
          {
            ...(input.refinedFromUser && { senderId: input.refinedFromUser.id }),
            ...(input.notificationParentId && { parentId: input.notificationParentId }),
            type: input.payloadData.notificationType,
            enTitle: input.payloadData.enTitle,
            arTitle: input.payloadData.arTitle,
            enBody: input.payloadData.enBody,
            arBody: input.payloadData.arBody,
            thumbnail:
              input.payloadData.thumbnail ||
              `${this.configService.get('API_BASE')}/default/logo.png`,
            returnItToClient: NotificationTypeReturnedToUser.includes(
              input.payloadData.notificationType
            ),
            log: JSON.stringify(input.messagingResponse)
          },
          null,
          transaction
        );

        const users = await this.userRepo.findUsersByFilter({
          id: [...input.tokensAndIds.EN.ids, ...input.tokensAndIds.AR.ids].map(
            obj => obj.receiverId
          )
        });

        await notification.$add('receivers', users, { transaction: transaction });

        this.logger.warn(
          '**********************************************************',
          `CHECK NOTIFICATION ID IN DB: ${notification.id}`,
          '**********************************************************'
        );

        return notification;
      });
    } catch (error) {
      throw new BaseHttpException('EN', error.status || 500, error.message);
    }
  }

  async notifications(filter: FilterNotificationsInput = {}, paginate: PaginatorInput = {}) {
    try {
      const notifications = await this.notificationRepo.findPaginatedNotificationsByFilter(
        {
          returnItToClient: true,
          ...(filter.searchKey && {
            [Op.or]: {
              enTitle: { [Op.iLike]: `%${filter.searchKey}%` },
              arTitle: { [Op.iLike]: `%${filter.searchKey}%` },
              enBody: { [Op.iLike]: `%${filter.searchKey}%` },
              arBody: { [Op.iLike]: `%${filter.searchKey}%` }
            }
          })
        },
        [{createdAt: SortEnum.DESC}],
        paginate.page,
        paginate.limit,
        [
          {
            model: User,
            // where: { id: currentUser.id },// The same as `through` attribute
            attributes: ['id'],
            required: true,
            through: { where: { receiverId: this.context.currentUser.id } }
          }
        ]
      );

      const notificationIds = notifications.items.reduce((total, not) => {
        total.push(not.id);
        return total;
      }, []);

      // Set notification in seen status
      await this.notificationUserStatusRepo.updateNotificationUserStatuses(
        { notificationId: { [Op.in]: notificationIds }, seenAt: null },
        { seenAt: new Date() }
      );

      return notifications;
    } catch (error) {
      throw new BaseHttpException('EN', error.status || 500, error.message);
    }
  }

  async notification(notificationId: string) {
    try {
      const notification = await this.notificationRepo.findNotificationByFilter({
        id: notificationId
      });

      if (!notification) throw new BaseHttpException(this.context.lang, 649);

      return notification;
    } catch (error) {
      throw new BaseHttpException('EN', error.status || 500, error.message);
    }
  }

  async setNotificationsInSeenStatus(input: SetNotificationsInSeenStatusInput) {
    try {
      await this.notificationUserStatusRepo.updateNotificationUserStatuses(
        { seenAt: new Date().toISOString() },
        { notificationId: { [Op.in]: input.notificationIds } }
      );
      return true;
    } catch (error) {
      throw new BaseHttpException('EN', error.status || 500, error.message);
    }
  }

  async sendNotification(input: SendNotificationInput): Promise<boolean> {
    try {
      const users = await this.userRepo.findUsersByFilter({ id: input.usersIds });

      await this.pusherService.push(
        users,
        {
          arBody: input.arBody,
          enBody: input.enBody,
          enTitle: input.enTitle,
          arTitle: input.arTitle,
          notificationType: input.notificationType,
          thumbnail: `${this.configService.get('API_BASE')}/default/logo.png`
        },
        this.context.currentUser
      );
      return true;
    } catch (error) {
      throw new BaseHttpException('EN', error.status || 500, error.message);
    }
  }

  async deleteNotification(notificationId: string) {
    try {
      const notification = await this.notificationRepo.findNotificationByFilter({
        id: notificationId
      });
      if (!notification) throw new BaseHttpException(this.context.lang, 649);

      const notificationUser = await this.notificationUserStatusRepo.findNotificationUserStatusesByFilter(
        { notificationId: notification.id, receiverId: this.context.currentUser.id }
      );
      if (!notificationUser) throw new BaseHttpException(this.context.lang, 600);

      await this.notificationRepo.deleteNotification({ id: notificationId });

      return true;
    } catch (error) {
      throw new BaseHttpException('EN', error.status || 500, error.message);
    }
  }

  async manageMyNotifications(input: ManageMyNotificationsInput) {
    try {
      const currentUser = await this.userRepo.findUserByFilter({
        where: { id: this.context.currentUser.id }
      });

      currentUser.notificationManager = {
        VIA_EMAIL: input.VIA_EMAIL || false,
        VIA_PUSH: input.VIA_PUSH || false,
        WHEN_RECOMMENDATIONS: input.WHEN_RECOMMENDATIONS || false
      };
      return await currentUser.save();
    } catch (error) {
      throw new BaseHttpException('EN', error.status || 500, error.message);
    }
  }
}
