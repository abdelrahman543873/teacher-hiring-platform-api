import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { GqlStringResponse } from '../_common/graphql/graphql-response.type';
import { AppConfigurationService } from './app-configuration.service';
import { HasPermission } from '../auth/auth.metadata';
import { UseGuards } from '@nestjs/common';
import {
  GqlAppConfigurationResponse,
  GqlAppConfigurationsArrayResponse
} from './app-configuration.response';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateAppConfigurationInput } from './inputs/create-app-configurations.input';
import { AppConfigurationPermissionsEnum } from '../security-group/security-group-permissions';
import { UpdateAppConfigurationInput } from './inputs/update-app-configuration.input';
import { AppConfigurationInput } from './inputs/app-configuration.input';

@Resolver()
export class AppConfigurationResolver {
  constructor(private readonly appConfigurationService: AppConfigurationService) {}
  //** --------------------- QUERIES --------------------- */

  @Query(returns => GqlStringResponse)
  async termsAndConditions() {
    return await this.appConfigurationService.localizedAppConfiguration('terms');
  }

  @HasPermission(AppConfigurationPermissionsEnum.READ_APP_CONFIGURATION)
  @UseGuards(AuthGuard)
  @Query(returns => GqlAppConfigurationResponse)
  async appConfigurationBoard(@Args('input') input: AppConfigurationInput) {
    return await this.appConfigurationService.checkIfConfigurationExists(input);
  }

  @HasPermission(AppConfigurationPermissionsEnum.READ_APP_CONFIGURATION)
  @UseGuards(AuthGuard)
  @Query(returns => GqlAppConfigurationsArrayResponse)
  async appConfigurationsBoard() {
    return await this.appConfigurationService.appConfigurationsBoard();
  }

  //** --------------------- MUTATIONS --------------------- */
  @HasPermission(AppConfigurationPermissionsEnum.CREATE_APP_CONFIGURATION)
  @UseGuards(AuthGuard)
  @Mutation(returns => GqlAppConfigurationResponse)
  async createAppConfigurationBoard(@Args('input') input: CreateAppConfigurationInput) {
    return await this.appConfigurationService.createAppConfigurationBoard(input);
  }

  @HasPermission(AppConfigurationPermissionsEnum.UPDATE_APP_CONFIGURATION)
  @UseGuards(AuthGuard)
  @Mutation(() => GqlAppConfigurationResponse)
  async updateAppConfigurationBoard(@Args('input') input: UpdateAppConfigurationInput) {
    return await this.appConfigurationService.updateAppConfigurationBoard(input);
  }
}
