import * as DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { Notification } from './models/notification.model';
import { User } from 'src/user/models/user.model';
import { NotificationUserStatusRepository } from './repositories/notification-user-status.repository';
import { Op } from 'sequelize';
import { NotificationReceiver } from './notification.type';
import { SecurityGroupRepository } from 'src/security-group/security-group.repository';
import { UserRepository } from 'src/user/repositories/user.repository';

@Injectable({ scope: Scope.REQUEST })
export class NotificationDataloader {
  constructor(
    private readonly notificationUserStatusRepo: NotificationUserStatusRepository,
    private readonly securityGroupRepo: SecurityGroupRepository,
    private readonly userRepo: UserRepository
  ) {}

  private overrideNotificationsWithMatchedParentInstances(
    parentInstances: any,
    parentsIds: string[],
    notifications: Notification[]
  ) {
    const parentIdsHaveNoInstancesInDb = Array.from(
      new Set(parentsIds.filter(parId => !parentInstances.map((p: any) => p.id).includes(parId)))
    );
    parentIdsHaveNoInstancesInDb.map(p => {
      const matchedNotifications = notifications.filter((n: Notification) => n.parentId === p);
      matchedNotifications.map((mn: Notification) => {
        const parentIndex = notifications.findIndex((n: Notification) => n.id === mn.id);
        notifications[parentIndex] = { notExistRecord: true } as any;
      });
    });

    parentInstances.map((c: any) => {
      const matchedNotifications = notifications.filter(n => n.parentId === c.id);
      matchedNotifications.map(mn => {
        const parentIndex = notifications.findIndex(n => n.id === mn.id);
        notifications[parentIndex] = c;
      });
    });
  }

  parentLoader: DataLoader<Notification, any> = new DataLoader(async (notifications: any[]) => {
    const groupedNotificationsByType = notifications.reduce((total, not) => {
      if (!total[not.type]) total[not.type] = [{ parentId: not.parentId }];
      else total[not.type].push({ parentId: not.parentId });
      return total;
    }, {});

    const notificationTypes = Object.keys(groupedNotificationsByType);
    for (const type of notificationTypes) {
      if (['NEW_USER'].includes(type)) {
        const parentsIds = groupedNotificationsByType[type].reduce(
          (tot: string[], obj: Notification) => {
            tot.push(obj.parentId);
            return tot;
          },
          []
        );
        const messages = await this.userRepo.findUsersByFilter({
          id: parentsIds
        });
        this.overrideNotificationsWithMatchedParentInstances(messages, parentsIds, notifications);
      }
    }

    return notifications;
  });

  senderLoader: DataLoader<string, User> = new DataLoader(async (senderIds: string[]) => {
    const users = await this.userRepo.findUsersByFilter({ id: senderIds });
    const obj = users.reduce((total, user) => {
      const { id } = user;
      if (!total[id]) total[id] = {};
      if (total[id]) total[id] = user;
      return total;
    }, {});
    return senderIds.map(id => obj[id]);
  });

  receiversLoader: DataLoader<
    { notification: Notification; currentUser: User },
    NotificationReceiver[]
  > = new DataLoader(async (args: { notification: Notification; currentUser: User }[]) => {
    const currentUser = args[0].currentUser;
    const superAdminSecurityGroup = await this.securityGroupRepo.findSecurityGroupByFilter({
      name: 'SuperAdmin'
    });

    // If current user was not the super admin, then receiver always will be the current user
    // If current user was the super admin, he can see all notifications receivers

    const notificationIds = args.reduce((total, obj) => {
      if (!total.includes(obj.notification.id)) total.push(obj.notification.id);
      return total;
    }, []);
    const notificationUserStatuses = await this.notificationUserStatusRepo.findNotificationUserStatusesByFilter(
      { notificationId: { [Op.in]: notificationIds } },
      [User]
    );

    return notificationIds.map(id =>
      notificationUserStatuses
        .filter(nus => nus.notificationId === id)
        .reduce((total, obj) => {
          total.push({
            seenAt: obj.seenAt ? obj.seenAt.valueOf() : null,
            receiver:
              !superAdminSecurityGroup || currentUser.securityGroupId !== superAdminSecurityGroup.id
                ? currentUser
                : obj.receiver
          });
          return total;
        }, <{ seenAt: number; receiver: User }[]>[])
    );
  });
}
