import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Parent, ResolveField, Resolver, Query, Args, Context, Float } from '@nestjs/graphql';
import { School } from 'src/school/models/school.model';
import { User } from './models/user.model';
import { UserDataLoader } from './user.dataloader';
import { GqlCitiesResponse, GqlUserResponse, GqlUsersResponse } from './user.response';
import { UserService } from './user.service';
import { SecurityGroup } from 'src/security-group/security-group.model';
import { CurrentUser } from 'src/auth/auth-user.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userDataLoader: UserDataLoader,
    private readonly userService: UserService
  ) {}
  /******************************************Queries**********************************************/
  @Query(() => GqlCitiesResponse)
  async cities() {
    return this.userService.cities();
  }

  @Query(() => GqlUserResponse)
  async findUser(@Args('id') id: string) {
    return await this.userService.findUser(id);
  }

  @Query(() => GqlUsersResponse)
  async users() {
    return await this.userService.users();
  }

  /******************************************DataLoaders**********************************************/
  @ResolveField(() => School, { nullable: true })
  async school(@Parent() user) {
    return await this.userDataLoader.schoolsLoader.load(user.id);
  }

  @ResolveField(() => Boolean)
  async isComplete(@Parent() user) {
    return await this.userService.isComplete(user);
  }

  @ResolveField(() => SecurityGroup, { nullable: true })
  async securityGroup() {
    return null;
  }

  @ResolveField(() => Float, {
    nullable: true,
    description:
      'this filed compute value in km in sum queries like Teacher that might based on providing lat and long to compute distance this filed will have a value based on the difference between provided point and the result other wise will be based on current user location'
  })
  async awayFromCurrentUserBy(@Parent() user, @CurrentUser() currentUser) {
    // if distance not already computed in the query use dataloader
    if ((user as any).distance) {
      return user.distance / 1000;
    }
    return await this.userDataLoader.awayFromCurrentUserLoaderBy(currentUser).load(user.id);
  }
}
