import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Resolver, Args, Query, Mutation, ID } from '@nestjs/graphql';
import { CurriculumService } from './curriculum.service';
import { CurriculumInput } from './inputs/curriculum.input';
import { GqlCurriclumsResponse, GqlCurriclumResponse } from './curriculum.response';
import { CurriculumPermissionsEnum } from '../security-group/security-group-permissions';
import { UseGuards } from '@nestjs/common';
import { HasPermission } from '../auth/auth.metadata';
import { GqlBooleanResponse } from '../_common/graphql/graphql-response.type';
import { UpdateCurriculumInput } from './inputs/update-curriculum.input';

@Resolver()
export class CurriculumResolver {
  constructor(private readonly curriculumService: CurriculumService) {}
  //** --------------------- QUERIES --------------------- */
  @Query(() => GqlCurriclumResponse)
  async findCurriculum(@Args('id', { type: () => ID }) id: string) {
    return await this.curriculumService.findCurriculum(id);
  }

  @Query(() => GqlCurriclumsResponse)
  async Curriculums() {
    return await this.curriculumService.Curriculums();
  }
  //** --------------------- MUTATIONS --------------------- */
  @HasPermission(CurriculumPermissionsEnum.CREATE_CURRICULUM)
  @UseGuards(AuthGuard)
  @Mutation(() => GqlCurriclumResponse)
  async createCurriculum(@Args('input') input: CurriculumInput) {
    return await this.curriculumService.createCurriculum(input);
  }

  @HasPermission(CurriculumPermissionsEnum.UPDATE_CURRICULUM)
  @UseGuards(AuthGuard)
  @Mutation(() => GqlCurriclumResponse)
  async updateCurriculum(@Args('input') input: UpdateCurriculumInput) {
    return await this.curriculumService.updateCurriculum(input);
  }

  @HasPermission(CurriculumPermissionsEnum.DELETE_CURRICULUM)
  @UseGuards(AuthGuard)
  @Mutation(() => GqlBooleanResponse)
  async deleteCurriculum(@Args('id', { type: () => ID }) id: string) {
    return await this.curriculumService.deleteCurriculum(id);
  }
}
