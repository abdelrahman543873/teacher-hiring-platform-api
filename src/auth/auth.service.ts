import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { Injectable, Inject } from '@nestjs/common';
import { ResetPasswordByPhoneInput } from './inputs/reset-password-by-phone.input';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { User } from 'src/user/models/user.model';
import { DeviceEnum, UserRoleEnum } from 'src/user/user.enum';
import { UserRepository } from 'src/user/repositories/user.repository';
import { GqlContext } from 'src/_common/graphql/graphql-context.type';
import { CONTEXT } from '@nestjs/graphql';
import { SMSFactory, SMSProviderType } from 'src/_common/sms/sms.factory';
import { PhoneAndPasswordLoginInput } from './inputs/phone-password-login.input';
import { SendPhoneVerificationCodeInput } from './inputs/send-phone-verification-code.input';
import { PhoneVerificationHandler } from './VerificationHandlers/phone-verification.handler';
import { VerifyPhoneVerificationCodeInput } from './inputs/verify-verification-code.input';
import { env } from '../_common/utils/env';
import { ResetPasswordHandler } from './VerificationHandlers/reset-password.handler';
import { VerifyResetPasswordVerificationCode } from './inputs/verify-reset-password-code.input';
import { LoginBoardInput } from './inputs/login-board.input';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CONTEXT) private readonly context: GqlContext,
    private readonly userRepo: UserRepository,
    private readonly smsFactory: SMSFactory,
    private readonly phoneVerificationHandler: PhoneVerificationHandler,
    private readonly resetPasswordHandler: ResetPasswordHandler
  ) {}

  async login(loginInput: PhoneAndPasswordLoginInput): Promise<User> {
    try {
      const user = await this.userRepo.findAllUserDataByPhoneORUnverifiedPhone(loginInput.phone);
      if (!user) {
        throw new BaseHttpException(this.context.lang, 632);
      }
      const trueUser = await bcrypt.compare(loginInput.password, user.password);
      if (!trueUser) throw new BaseHttpException(this.context.lang, 632);
      const token = jwt.sign({ userId: user.id }, env.JWT_SECRET);
      user.token = token;
      return user;
    } catch (error) {
      throw new BaseHttpException(this.context.lang, error.status || 500, error.message);
    }
  }

  async loginBoard(input: LoginBoardInput) {
    try {
      const user = await this.userRepo.findUserByEmailForLoginBoard(input.email);
      if (!user) {
        throw new BaseHttpException(this.context.lang, 633);
      }
      if (user.role !== UserRoleEnum.SUPERADMIN) {
        throw new BaseHttpException(this.context.lang, 600);
      }
      const isMatched = await bcrypt.compare(input.password, user.password);
      if (!isMatched) throw new BaseHttpException(this.context.lang, 633);
      const token = jwt.sign({ userId: user.id }, env.JWT_SECRET);
      user.token = token;
      return user;
    } catch (error) {
      console.log(error);
      throw new BaseHttpException(this.context.lang, error.status || 500, error.message);
    }
  }

  async resetPasswordByPhone(input: ResetPasswordByPhoneInput): Promise<User> {
    try {
      const { user, code } = await this.resetPasswordHandler.verify(input);
      return await this.resetPasswordHandler.reset({ user, code, newPassword: input.newPassword });
    } catch (error) {
      throw new BaseHttpException(this.context.lang, error.status || 500, error.message);
    }
  }

  async sendResetPasswordCode(phone: string) {
    try {
      return await this.resetPasswordHandler.send(phone);
    } catch (error) {
      throw new BaseHttpException(this.context.lang, error.status || 500, error.message);
    }
  }

  async verifyResetPasswordVerificationCode(input: VerifyResetPasswordVerificationCode) {
    try {
      await this.resetPasswordHandler.verify(input);
      return true;
    } catch (error) {
      throw new BaseHttpException(this.context.lang, error.status || 500, error.message);
    }
  }

  async sendPhoneVerificationCode(input: SendPhoneVerificationCodeInput) {
    try {
      return await this.phoneVerificationHandler.send(input);
    } catch (error) {
      throw new BaseHttpException(this.context.lang, error.status || 500, error.message);
    }
  }

  async verifyPhoneVerificationCode(input: VerifyPhoneVerificationCodeInput): Promise<User> {
    try {
      return await this.phoneVerificationHandler.verify(input);
    } catch (error) {
      throw new BaseHttpException(this.context.lang, error.status || 500, error.message);
    }
  }

  async logout(device: DeviceEnum) {
    try {
      const fcmTokens = this.context.currentUser.fcmTokens;
      fcmTokens[device.toLowerCase()] = null;
      const currentUser = await this.userRepo.findUserByFilter({
        where: { id: this.context.currentUser.id }
      });
      await this.userRepo.updateUserFromExistingModel(currentUser, { fcmTokens });
      return true;
    } catch (error) {
      throw new BaseHttpException(this.context.lang, error.status || 500, error.message);
    }
  }

  async sendMessage(): Promise<boolean> {
    try {
      this.smsFactory.sendSMS(SMSProviderType.AMAZON, '+201008155883', 'hello!');
      return true;
    } catch (error) {
      throw new BaseHttpException(this.context.lang, error.status || 500, error.message);
    }
  }

  async updateFcmToken(fcmToken: string, device: DeviceEnum) {
    try {
      const fcmTokens = this.context.currentUser.fcmTokens;
      fcmTokens[device.toLowerCase()] = fcmToken;
      const currentUser = await this.userRepo.findUserByFilter({
        where: { id: this.context.currentUser.id }
      });
      await this.userRepo.updateUserFromExistingModel(currentUser, { fcmTokens });
      return true;
    } catch (error) {
      throw new BaseHttpException(this.context.lang, error.status || 500, error.message);
    }
  }

  async setLastActiveDetails(device: DeviceEnum, platformDetails: Record<string, any>) {
    try {
      const currentUser = await this.userRepo.findUserByFilter({
        where: { id: this.context.currentUser.id }
      });
      await this.userRepo.updateUserFromExistingModel(currentUser, {
        lastLoginDevice: device,
        platformDetails,
        lastLoginAt: new Date()
      });
      return currentUser;
    } catch (error) {
      throw new BaseHttpException(this.context.lang, error.status || 500, error.message);
    }
  }
}
