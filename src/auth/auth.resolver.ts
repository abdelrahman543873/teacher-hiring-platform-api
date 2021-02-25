import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { GqlUserResponse } from 'src/user/user.response';
import { GqlBooleanResponse } from 'src/_common/graphql/graphql-response.type';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './auth-user.decorator';
import { DeviceEnum, StatusEnum } from 'src/user/user.enum';
import { User } from 'src/user/models/user.model';
import { JSON } from 'src/_common/graphql/json.scalar';
import { PhoneAndPasswordLoginInput } from './inputs/phone-password-login.input';
import { SendPhoneVerificationCodeInput } from './inputs/send-phone-verification-code.input';
import { StatusGuard } from './guards/status.guard';
import { HasStatus } from './auth.metadata';
import { ResetPasswordByPhoneInput } from './inputs/reset-password-by-phone.input';

import { VerifyPhoneVerificationCodeInput } from './inputs/verify-verification-code.input';
import { VerifyResetPasswordVerificationCode } from './inputs/verify-reset-password-code.input';
import { LoginBoardInput } from './inputs/login-board.input';
@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  //** --------------------- QUERIES --------------------- */

  @UseGuards(AuthGuard)
  @Query(returns => GqlUserResponse)
  async me(@CurrentUser() user: User) {
    return user;
  }

  //** --------------------- MUTATIONS --------------------- */

  @Mutation(() => GqlUserResponse)
  async login(@Args('loginInput') loginInput: PhoneAndPasswordLoginInput) {
    return await this.authService.login(loginInput);
  }

  @Mutation(() => GqlUserResponse)
  async loginBoard(@Args('input') input: LoginBoardInput) {
    return await this.authService.loginBoard(input);
  }

  @HasStatus(StatusEnum.ACCEPTED, StatusEnum.PENDING)
  @UseGuards(AuthGuard, StatusGuard)
  @Mutation(returns => GqlUserResponse)
  async sendPhoneVerificationCode(@Args() input: SendPhoneVerificationCodeInput) {
    return await this.authService.sendPhoneVerificationCode(input);
  }

  @HasStatus(StatusEnum.ACCEPTED, StatusEnum.PENDING)
  @UseGuards(AuthGuard, StatusGuard)
  @Mutation(returns => GqlUserResponse)
  async verifyPhoneVerificationCode(@Args() input: VerifyPhoneVerificationCodeInput) {
    return await this.authService.verifyPhoneVerificationCode(input);
  }

  @Mutation(returns => GqlBooleanResponse)
  async sendResetPasswordCode(@Args('phone') phone: string) {
    return await this.authService.sendResetPasswordCode(phone);
  }

  @Mutation(returns => GqlUserResponse)
  async resetPasswordByPhone(@Args('input') input: ResetPasswordByPhoneInput) {
    return await this.authService.resetPasswordByPhone(input);
  }

  @Mutation(returns => GqlBooleanResponse)
  async verifyResetPasswordVerificationCode(
    @Args('input') input: VerifyResetPasswordVerificationCode
  ) {
    return await this.authService.verifyResetPasswordVerificationCode(input);
  }

  @UseGuards(AuthGuard)
  @Mutation(returns => GqlBooleanResponse)
  async logout(@Args({ name: 'device', type: () => DeviceEnum }) device: DeviceEnum) {
    return await this.authService.logout(device);
  }

  @UseGuards(AuthGuard)
  @Mutation(returns => GqlBooleanResponse)
  async updateFcmToken(
    @Args({ name: 'device', type: () => DeviceEnum }) device: DeviceEnum,
    @Args('fcmToken') fcmToken: string
  ) {
    return await this.authService.updateFcmToken(fcmToken, device);
  }

  @UseGuards(AuthGuard)
  @Mutation(returns => GqlUserResponse)
  async setLastActiveDetails(
    @Args({ name: 'device', type: () => DeviceEnum }) device: DeviceEnum,
    @Args({ name: 'platformDetails', type: () => JSON }) platformDetails: Record<string, any>
  ) {
    return await this.authService.setLastActiveDetails(device, platformDetails);
  }
}
