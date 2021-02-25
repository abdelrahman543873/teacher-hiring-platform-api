import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Mutation, Resolver, Args, Query } from '@nestjs/graphql';
import { HasPermission } from '../auth/auth.metadata';
import { SecurityGroupPermissionsEnum } from '../security-group/security-group-permissions';
import { GqlUserResponse, GqlUsersResponse } from '../user/user.response';
import { UseGuards } from '@nestjs/common';
import { UserUpdatesService } from './user-updates.service';
import { UpdateUserStatusInput } from './inputs/update-user-status.input';
import { ViewUsersRequestsInput } from './inputs/view-user-requests.input';

@Resolver()
export class UserUpdatesResolver {
  constructor(private readonly userUpdatesService: UserUpdatesService) {}

  @HasPermission(SecurityGroupPermissionsEnum.UPDATE_ROLES)
  @UseGuards(AuthGuard)
  @Mutation(() => GqlUserResponse)
  async updateUserStatus(@Args('input') input: UpdateUserStatusInput) {
    return await this.userUpdatesService.updateUserStatus(input);
  }

  @HasPermission(SecurityGroupPermissionsEnum.READ_ROLES)
  @UseGuards(AuthGuard)
  @Query(() => GqlUsersResponse)
  async viewUserRequests(@Args('input') input: ViewUsersRequestsInput) {
    return await this.userUpdatesService.viewUsersRequests(input);
  }
}
