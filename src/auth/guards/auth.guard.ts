import { CanActivate, ExecutionContext, Injectable, OnModuleInit } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector, ModuleRef } from '@nestjs/core';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { GqlContext } from 'src/_common/graphql/graphql-context.type';
import { HelperService } from 'src/_common/utils/helper.service';

@Injectable()
export class AuthGuard implements CanActivate, OnModuleInit {
  private helperService: HelperService;

  constructor(private readonly reflector: Reflector, private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.helperService = this.moduleRef.get(HelperService, { strict: false });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<string[]>('permissions', context.getHandler());
    const ctx = GqlExecutionContext.create(context);
    const { currentUser, lang } = ctx.getContext() as GqlContext;
    if (!currentUser) throw new BaseHttpException(lang, 600);
    if (
      permissions &&
      permissions.length &&
      !this.helperService.hasPermission(permissions[0], currentUser)
    )
      throw new BaseHttpException(lang, 600);

    return true;
  }
}
