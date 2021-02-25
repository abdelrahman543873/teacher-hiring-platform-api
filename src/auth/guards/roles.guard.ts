import { CanActivate, ExecutionContext, Injectable, OnModuleInit } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector, ModuleRef } from '@nestjs/core';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { GqlContext } from 'src/_common/graphql/graphql-context.type';
import { LangEnum, UserRoleEnum } from 'src/user/user.enum';
import { HelperService } from 'src/_common/utils/helper.service';

@Injectable()
export class RoleGuard implements CanActivate, OnModuleInit {
  private helperService: HelperService;

  constructor(private readonly reflector: Reflector, private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.helperService = this.moduleRef.get(HelperService, { strict: false });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<UserRoleEnum[]>('roles', context.getHandler());
    const ctx = GqlExecutionContext.create(context);
    const { currentUser, lang } = ctx.getContext() as GqlContext;
    if (!currentUser) throw new BaseHttpException(lang, 600);
    if (roles?.length && !this.helperService.hasRole(roles[0], currentUser)) {
      this.throwErrorBasedOnRole(currentUser.role, lang);
    }
    return true;
  }

  private throwErrorBasedOnRole(role: UserRoleEnum, lang: LangEnum) {
    let status_code = 500;
    if (role === UserRoleEnum.SCHOOLADMIN) {
      status_code = 628;
    } else if (role === UserRoleEnum.TEACHER) {
      status_code = 629;
    } else if (role === UserRoleEnum.SUPERADMIN) {
      status_code = 630;
    }
    throw new BaseHttpException(lang, status_code);
  }
}
