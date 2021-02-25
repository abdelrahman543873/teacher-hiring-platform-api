import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GqlSubjectsResponse, GqlSubjectResponse } from '../subject/subject.response';
import { ResolveField, Parent, Resolver, Query, Args, ID, Mutation } from '@nestjs/graphql';
import { Teacher } from './models/teacher.model';
import { GqlTeacherResponse } from './teacher.response';
import { TeacherService } from './teacher.service';
import { GqlCurriclumResponse, GqlCurriclumsResponse } from '../curriculum/curriculum.response';
import { TeacherSubjectDataLoader } from './teacher-subject.dataloader';
import { TeacherCurriculumDataLoader } from './teacher-curriculum.dataloader';
import { UseGuards } from '@nestjs/common';
import {
  SubjectPermissionsEnum,
  CurriculumPermissionsEnum
} from '../security-group/security-group-permissions';
import { HasPermission, HasRoles, HasStatus } from '../auth/auth.metadata';
import { registerAsTeacherInput } from './inputs/register-as-teacher.input';
import { GqlUserResponse, GqlUsersResponse } from '../user/user.response';
import { CompleteTeacherRegisterationInput } from './inputs/complete-teacher-registeration.input';
import { UserRoleEnum, StatusEnum } from '../user/user.enum';
import { RoleGuard } from '../auth/guards/roles.guard';
import { StatusGuard } from '../auth/guards/status.guard';
import { GetTeachersInput } from './inputs/teachers.input';
@Resolver(() => Teacher)
export class TeacherResolver {
  /***********************************Queries****************************************/
  constructor(
    private readonly teacherSubjectDataLoader: TeacherSubjectDataLoader,
    private readonly teacherCurriculumDataLoader: TeacherCurriculumDataLoader,
    private readonly teacherService: TeacherService
  ) {}

  @HasRoles(UserRoleEnum.SCHOOLADMIN)
  @HasStatus(StatusEnum.ACCEPTED)
  @UseGuards(AuthGuard, RoleGuard, StatusGuard)
  @Query(() => GqlUsersResponse, { name: 'Teachers' })
  async getTeachers(@Args('input') input: GetTeachersInput) {
    return await this.teacherService.getTeachers(input);
  }

  /***********************************Muatations****************************************/
  @Mutation(() => GqlUserResponse)
  async registerAsTeacher(@Args('input') input: registerAsTeacherInput) {
    return await this.teacherService.registerAsTeacher(input);
  }

  @HasRoles(UserRoleEnum.TEACHER)
  @HasStatus(StatusEnum.PENDING)
  @UseGuards(AuthGuard, RoleGuard, StatusGuard)
  @Mutation(() => GqlTeacherResponse)
  async completeTeacherProfile(@Args('input') input: CompleteTeacherRegisterationInput) {
    return await this.teacherService.completeTeacherProfile(input);
  }

  @HasPermission(SubjectPermissionsEnum.UPDATE_SUBJECTS)
  @UseGuards(AuthGuard)
  @Mutation(() => GqlSubjectResponse)
  async chooseTeacherSubject(
    @Args('teacherId', { type: () => ID }) teacherId: string,
    @Args('subjectId', { type: () => ID }) subjectId: string
  ) {
    return await this.teacherService.chooseTeacherSubject(teacherId, subjectId);
  }

  @HasPermission(CurriculumPermissionsEnum.UPDATE_CURRICULUM)
  @UseGuards(AuthGuard)
  @Mutation(() => GqlCurriclumResponse)
  async chooseTeacherCurriculum(
    @Args('teacherId', { type: () => ID }) teacherId: string,
    @Args('curriculumId', { type: () => ID }) curriculumId: string
  ) {
    return await this.teacherService.chooseTeacherCurriculum(teacherId, curriculumId);
  }
  /******************************************DataLoaders*****************************/
  @ResolveField(() => GqlSubjectsResponse, { nullable: 'itemsAndList' })
  async subjects(@Parent() teacher) {
    return await this.teacherSubjectDataLoader.subjectDataLoader.load(teacher.teacherId);
  }

  @ResolveField(() => GqlCurriclumsResponse, { nullable: 'itemsAndList' })
  async curriculums(@Parent() teacher) {
    return await this.teacherCurriculumDataLoader.curriculumDataLoader.load(teacher.teacherId);
  }
}
