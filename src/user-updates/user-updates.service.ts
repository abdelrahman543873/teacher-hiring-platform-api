import { Inject, Injectable } from '@nestjs/common';
import { BaseHttpException } from '../_common/exceptions/base-http-exception';
import { PusherService } from '../_common/pusher/pusher.service';
import { UserAccepted, UserRejected, UserPending } from './user-updates.constants';
import { UpdateUserStatusInput } from './inputs/update-user-status.input';
import { StatusEnum } from '../user/user.enum';
import { TeacherOrSchoolAdminEnum } from './user-updates.enum';
import { UserRepository } from '../user/repositories/user.repository';
import { UserUpdatesRepository } from './user-updates.repository';
import { ViewUsersRequestsInput } from './inputs/view-user-requests.input';
import { CONTEXT } from '@nestjs/graphql';
import { GqlContext } from 'src/_common/graphql/graphql-context.type';

@Injectable()
export class UserUpdatesService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly userUpdatesRepo: UserUpdatesRepository,
    private readonly pusherService: PusherService,
    @Inject(CONTEXT) private readonly context: GqlContext
  ) {}

  async updateUserStatus(updateUserStatus: UpdateUserStatusInput) {
    const user = await this.userRepo.findCurrentUserForContext(updateUserStatus.id);
    if (!user) throw new BaseHttpException('EN', 642);
    if (!user.phone) throw new BaseHttpException('EN', 648);
    const updatedUser = await this.userUpdatesRepo.updateUserStatus(updateUserStatus);
    if (updateUserStatus.status === StatusEnum.ACCEPTED) {
      await this.pusherService.push([user], UserAccepted);
    } else if (updateUserStatus.status === StatusEnum.PENDING) {
      await this.pusherService.push([user], UserPending);
    } else {
      await this.pusherService.push([user], UserRejected);
    }
    return updatedUser;
  }

  async viewUsersRequests(input: ViewUsersRequestsInput) {
    try {
      return await this.userUpdatesRepo.viewPaginatedRequestsByRole(
        input?.filterBy?.role,
        input?.sortBy,
        { page: input.page, limit: input.limit }
      );
    } catch (error) {
      throw new BaseHttpException('EN', error.status || 500, error.message);
    }
  }
}
