import { Inject, Injectable } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { GqlContext } from 'src/_common/graphql/graphql-context.type';
import { SubjectRepository } from './subject.repository';

@Injectable()
export class SubjectValidator {
  constructor(
    private readonly subjectRepository: SubjectRepository,
    @Inject(CONTEXT) private readonly context: GqlContext
  ) {}

  async validateSubjectCount(subjectsIds: string[]): Promise<void> {
    const subjectCount = await this.subjectRepository.countSubjectsByIds(subjectsIds);
    if (subjectCount !== subjectsIds.length) {
      throw new BaseHttpException(this.context.lang, 645);
    }
  }
}
