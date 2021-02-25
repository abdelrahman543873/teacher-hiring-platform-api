import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Query, Resolver, Args, Mutation, ID } from '@nestjs/graphql';
import { HasPermission } from 'src/auth/auth.metadata';
import { SubjectService } from './subject.service';
import { GqlSubjectResponse, GqlSubjectsResponse } from './subject.response';
import { SubjectPermissionsEnum } from '../security-group/security-group-permissions';
import { SubjectInput } from './input/subject.input';
import { GqlBooleanResponse } from '../_common/graphql/graphql-response.type';
import { UpdateSubjectInput } from './input/update-subject.input';

@Resolver()
export class SubjectResolver {
  constructor(private readonly subjectService: SubjectService) {}
  //** --------------------- QUERIES --------------------- */
  @Query(() => GqlSubjectResponse)
  async findSubject(@Args('id', { type: () => ID }) id: string) {
    return await this.subjectService.findSbuject(id);
  }

  @Query(() => GqlSubjectsResponse)
  async Subjects() {
    return await this.subjectService.subjects();
  }
  //** --------------------- MUTATIONS --------------------- */
  @HasPermission(SubjectPermissionsEnum.CREATE_SUBJECTS)
  @UseGuards(AuthGuard)
  @Mutation(() => GqlSubjectResponse)
  async createSubject(@Args('input') input: SubjectInput) {
    return await this.subjectService.createSubject(input);
  }

  @HasPermission(SubjectPermissionsEnum.UPDATE_SUBJECTS)
  @UseGuards(AuthGuard)
  @Mutation(() => GqlSubjectResponse)
  async updateSubject(@Args('input') input: UpdateSubjectInput) {
    return await this.subjectService.updateSubject(input);
  }

  @HasPermission(SubjectPermissionsEnum.DELETE_SUBJECTS)
  @UseGuards(AuthGuard)
  @Mutation(() => GqlBooleanResponse)
  async deleteSubject(@Args('id', { type: () => ID }) id: string) {
    return await this.subjectService.deleteSubject(id);
  }
}
