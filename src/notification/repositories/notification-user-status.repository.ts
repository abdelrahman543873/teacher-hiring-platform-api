import { Injectable } from '@nestjs/common';
import { WhereOptions, Transaction, Includeable } from 'sequelize/types';
import { NotificationUserStatus } from '../models/notification-user-status.model';

@Injectable()
export class NotificationUserStatusRepository {
  async findNotificationUserStatusesByFilter(
    where: WhereOptions = {},
    include: Includeable[] = []
  ) {
    return await NotificationUserStatus.findAll({ where, include });
  }

  async updateNotificationUserStatusFromExistingModel(
    notification: NotificationUserStatus,
    input = {},
    transaction?: Transaction
  ) {
    return await notification.update(input, { ...(transaction && { transaction }) });
  }

  async updateNotificationUserStatuses(where: WhereOptions = {}, input = {}) {
    return await NotificationUserStatus.update(input, { where });
  }

  async truncateNotificationModel() {
    await NotificationUserStatus.truncate({ cascade: true, force: true });
  }
}
