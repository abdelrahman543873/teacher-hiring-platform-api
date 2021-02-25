import { forwardRef, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationUserStatusRepository } from './repositories/notification-user-status.repository';
import { NotificationDataloader } from './notification.dataloader';
import { PusherModule } from 'src/_common/pusher/pusher.module';
import { UserModule } from 'src/user/user.module';
import { SecurityGroupModule } from 'src/security-group/security-group.module';
import { DatabaseModule } from 'src/_common/database/database.module';
@Module({
  imports: [UserModule, SecurityGroupModule, DatabaseModule, forwardRef(() => PusherModule)],
  providers: [
    NotificationService,
    NotificationResolver,
    NotificationRepository,
    NotificationUserStatusRepository,
    NotificationDataloader
  ],
  exports: [NotificationService]
})
export class NotificationModule {}
