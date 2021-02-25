import { Injectable } from '@nestjs/common';
import { WhereOptions, Includeable, Transaction } from 'sequelize';
import { Notification } from '../models/notification.model';

@Injectable()
export class NotificationRepository {
  async findNotificationByFilter(where: WhereOptions = {}, include: Includeable[] = []) {
    return await Notification.findOne({ where, include });
  }

  async findNotificationsByFilter(where: WhereOptions = {}, include: Includeable[] = []) {
    return await Notification.findAll({ where, include });
  }

  async findPaginatedNotificationsByFilter(
    filter: WhereOptions = {},
    sort,
    page: number = 0,
    limit: number = 15,
    include: Includeable[] = []
  ) {
    return await Notification.paginate({ filter, sort, page, limit, include });
  }

  async createNotification(input = {}, include: Includeable[] = [], transaction?: Transaction) {
    return await Notification.create(input, { include, ...(transaction && { transaction }) });
  }

  async createNotifications(models: {}[]) {
    return await Notification.bulkCreate(models);
  }

  async updateNotificationFromExistingModel(
    notification: Notification,
    input = {},
    transaction?: Transaction
  ) {
    return await notification.update(input, { ...(transaction && { transaction }) });
  }

  async updateNotifications(where: WhereOptions = {}, input = {}) {
    return await Notification.update(input, { where });
  }

  async deleteNotification(where: WhereOptions = {}) {
    await Notification.destroy({ where });
  }

  async truncateNotificationModel() {
    await Notification.truncate({ cascade: true, force: true });
  }
}
