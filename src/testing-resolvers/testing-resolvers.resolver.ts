import { Resolver, Mutation, Query } from '@nestjs/graphql';
import { GqlUsersArrayResponse } from '../user/user.response';
import { TestingResolversService } from './testing-resolvers.service';

@Resolver()
export class TestingResolversResolver {
  constructor(private readonly testingResolversService: TestingResolversService) {}
  /***********************************Queries****************************************/
  @Query(() => GqlUsersArrayResponse)
  async getUsers() {
    return await this.testingResolversService.getUsers();
  }

  @Query(() => GqlUsersArrayResponse)
  async getAdminToken() {
    return await this.testingResolversService.getAdminToken();
  }
  /***********************************Muatations****************************************/
  @Mutation(() => GqlUsersArrayResponse)
  async createAdminToken() {
    return await this.testingResolversService.createAdminToken();
  }

  @Mutation(() => GqlUsersArrayResponse)
  async createFakeUsers() {
    return await this.testingResolversService.createFakeUsers();
  }
}
