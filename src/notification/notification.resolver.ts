import { Resolver, Args, Mutation, Query, ResolveField, Parent, Context } from '@nestjs/graphql';
import { User } from 'src/user/models/user.model';
import { UseGuards } from '@nestjs/common';
import { Notification } from './models/notification.model';
import { NotificationService } from './notification.service';
import { GqlNotificationsResponse, GqlNotificationResponse } from './notification-response.type';
import { NullablePaginatorInput } from 'src/_common/paginator/paginator.input';
import { NullableFilterNotificationsInput } from './inputs/filter-notifications.input';
import { GqlBooleanResponse } from 'src/_common/graphql/graphql-response.type';
import { SendNotificationInput } from './inputs/send-notification.input';
import { Timestamp } from 'src/_common/graphql/timestamp.scalar';
import { SetNotificationsInSeenStatusInput } from './inputs/set-notifications-in-seen-status.input';
import { ManageMyNotificationsInput } from './inputs/manage-my-notifications.input';
import { LangEnum } from 'src/user/user.enum';
import { NotificationParentUnion } from './notification.union';
import { NotificationDataloader } from './notification.dataloader';
import { NotificationReceiver } from './notification.type';
import { NotificationPermissionsEnum } from 'src/security-group/security-group-permissions';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GqlUserResponse } from 'src/user/user.response';
import { HasPermission } from 'src/auth/auth.metadata';
import { CurrentUser } from 'src/auth/auth-user.decorator';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationDataloader: NotificationDataloader
  ) {}

  //** --------------------- QUERIES --------------------- */

  @UseGuards(AuthGuard)
  @Query(returns => GqlNotificationsResponse)
  async notifications(
    @Args() filter: NullableFilterNotificationsInput,
    @Args() paginate: NullablePaginatorInput
  ) {
    return await this.notificationService.notifications(filter.filter, paginate.paginate);
  }

  @UseGuards(AuthGuard)
  @Query(returns => GqlNotificationResponse)
  async notification(@Args('notificationId') notificationId: string) {
    return await this.notificationService.notification(notificationId);
  }

  //** --------------------- MUTATIONS --------------------- */

  @UseGuards(AuthGuard)
  @Query(returns => GqlBooleanResponse)
  async setNotificationsInSeenStatus(@Args('input') input: SetNotificationsInSeenStatusInput) {
    return await this.notificationService.setNotificationsInSeenStatus(input);
  }

  @UseGuards(AuthGuard)
  @Mutation(returns => GqlBooleanResponse)
  async deleteNotification(@Args('notificationId') notificationId: string) {
    return await this.notificationService.deleteNotification(notificationId);
  }

  @UseGuards(AuthGuard)
  @Mutation(returns => GqlUserResponse)
  async manageMyNotifications(@Args('input') input: ManageMyNotificationsInput) {
    return await this.notificationService.manageMyNotifications(input);
  }

  @HasPermission(NotificationPermissionsEnum.SEND_NOTIFICATIONS)
  @UseGuards(AuthGuard)
  @Mutation(returns => GqlBooleanResponse)
  async sendNotificationForBoard(@Args('input') input: SendNotificationInput) {
    return await this.notificationService.sendNotification(input);
  }

  //** ------------------ RESOLVE FIELDS ------------------ */

  @ResolveField(type => Timestamp)
  createdAt(@Parent() notification) {
    return new Date(notification.createdAt).valueOf();
  }

  @ResolveField(type => Timestamp)
  updatedAt(@Parent() notification) {
    return new Date(notification.updatedAt).valueOf();
  }

  @ResolveField(type => String)
  localeTitle(@Context('lang') lang: LangEnum, @Parent() notification) {
    return notification[`${lang.toLowerCase()}Title`];
  }

  @ResolveField(type => String)
  localeBody(@Context('lang') lang: LangEnum, @Parent() notification) {
    return notification[`${lang.toLowerCase()}Body`];
  }

  //** --------------------- DATALOADER --------------------- */

  @ResolveField(type => NotificationParentUnion, { nullable: true })
  parent(@Parent() notification) {
    if (!notification.parentId) return null;
    return this.notificationDataloader.parentLoader.load(notification);
  }

  @ResolveField(type => User, { nullable: true })
  sender(@Parent() notification) {
    if (!notification.senderId) return null;
    return this.notificationDataloader.senderLoader.load(notification.senderId);
  }

  @ResolveField(type => [NotificationReceiver], { nullable: 'items' })
  receivers(@Parent() notification, @CurrentUser() currentUser) {
    if (!currentUser) return [];
    return this.notificationDataloader.receiversLoader.load({
      notification,
      currentUser
    });
  }
}
