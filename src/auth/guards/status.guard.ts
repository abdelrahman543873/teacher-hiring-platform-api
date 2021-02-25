import { CanActivate, ExecutionContext, Injectable, OnModuleInit } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector, ModuleRef } from '@nestjs/core';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { GqlContext } from 'src/_common/graphql/graphql-context.type';
import { LangEnum, StatusEnum } from 'src/user/user.enum';
import { HelperService } from 'src/_common/utils/helper.service';

@Injectable()
export class StatusGuard implements CanActivate, OnModuleInit {
  private helperService: HelperService;

  constructor(private readonly reflector: Reflector, private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.helperService = this.moduleRef.get(HelperService, { strict: false });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const status = this.reflector.get<StatusEnum[]>('status', context.getHandler());
    const ctx = GqlExecutionContext.create(context);
    const { currentUser, lang } = ctx.getContext() as GqlContext;
    if (!currentUser) throw new BaseHttpException(lang, 600);
    if (status?.length && !this.helperService.hasStatus(status, currentUser)) {
      this.throwErrorBasedOnStatus(currentUser.status, lang);
    }
    return true;
  }

  private throwErrorBasedOnStatus(status: StatusEnum, lang: LangEnum) {
    let status_code = 500;
    if (status === StatusEnum.ACCEPTED) {
      status_code = 621;
    } else if (status === StatusEnum.PENDING) {
      status_code = 622;
    } else if (status === StatusEnum.REJECTED) {
      status_code = 623;
    }
    throw new BaseHttpException(lang, status_code);
  }
}
