import { Args, Mutation, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { GqlUserResponse } from 'src/user/user.response';
import { RegisterAsSchoolInput } from './inputs/register-as-school-admin.input';
import { School } from './models/school.model';
import { SchoolService } from './school.service';
import { SchoolDataLoader } from './school.dataloader';
import { GqlCurriclumResponse } from '../curriculum/curriculum.response';
import { CompleteRegistrationAsSchool } from './inputs/complete-reg-as-school-admin';
import { UseGuards } from '@nestjs/common';
import { StatusGuard } from 'src/auth/guards/status.guard';
import { HasRoles, HasStatus } from 'src/auth/auth.metadata';
import { StatusEnum, UserRoleEnum } from 'src/user/user.enum';
import { RoleGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Resolver(() => School)
export class SchoolResolver {
  constructor(
    private readonly schoolService: SchoolService,
    private readonly schoolDataLoader: SchoolDataLoader
  ) {}

  /***********************************Mutations****************************************/
  @Mutation(() => GqlUserResponse)
  async registerAsSchoolAdmin(@Args('input') input: RegisterAsSchoolInput) {
    return await this.schoolService.registerAsSchoolAdmin(input);
  }

  @HasRoles(UserRoleEnum.SCHOOLADMIN)
  @HasStatus(StatusEnum.PENDING)
  @UseGuards(AuthGuard, RoleGuard, StatusGuard)
  @Mutation(() => GqlUserResponse)
  async completeRegistrationAsSchoolAdmin(@Args('input') input: CompleteRegistrationAsSchool) {
    return await this.schoolService.completeRegistrationAsSchoolAdmin(input);
  }
  /******************************************DataLoaders*****************************/
  @ResolveField(() => GqlCurriclumResponse, { nullable: 'itemsAndList' })
  async curriculums(@Parent() school) {
    return await this.schoolDataLoader.schoolDataLoader.load(school.id);
  }
}
