import { Module } from '@nestjs/common';
import { NotificationModule } from 'src/notification/notification.module';
import { PusherService } from './pusher.service';

@Module({
  imports: [NotificationModule],
  providers: [PusherService],
  exports: [PusherService]
})
export class PusherModule {}
