import { Module } from '@nestjs/common';
import { UserUpdatesService } from './user-updates.service';
import { UserUpdatesResolver } from './user-updates.resolver';
import { UserModule } from '../user/user.module';
import { UserUpdatesRepository } from './user-updates.repository';
import { PusherModule } from '../_common/pusher/pusher.module';

@Module({
  imports: [UserModule, PusherModule],
  providers: [UserUpdatesService, UserUpdatesResolver, UserUpdatesRepository]
})
export class UserUpdatesModule {}
