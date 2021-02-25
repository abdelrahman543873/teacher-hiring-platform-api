import { Inject, Injectable } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { GqlContext } from 'src/_common/graphql/graphql-context.type';
import { CurriculumRepository } from './curriculum.repository';

@Injectable()
export class CurriculumValidator {
  constructor(
    private readonly curriculumRepository: CurriculumRepository,
    @Inject(CONTEXT) private readonly context: GqlContext
  ) {}

  async validateCurriculumCount(curriculumsIds: string[]): Promise<void> {
    const curriculumCount = await this.curriculumRepository.countCurriculumByIds(curriculumsIds);
    if (curriculumCount !== curriculumsIds.length) {
      throw new BaseHttpException(this.context.lang, 627);
    }
  }
}
