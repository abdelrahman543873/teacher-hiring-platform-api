import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'src/user/user.module';
import { DatabaseModule } from 'src/_common/database/database.module';
import { SMSModule } from 'src/_common/sms/sms.module';
import { PhoneVerificationHandler } from './VerificationHandlers/phone-verification.handler';
import { ResetPasswordHandler } from './VerificationHandlers/reset-password.handler';
import { HelperModule } from '../_common/utils/helper.module';

@Module({
  imports: [DatabaseModule, SMSModule, UserModule, HelperModule],
  providers: [AuthResolver, AuthService, PhoneVerificationHandler, ResetPasswordHandler],
  exports: [AuthService]
})
export class AuthModule {}
