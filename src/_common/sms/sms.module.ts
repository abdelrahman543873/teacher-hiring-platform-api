import { Module } from '@nestjs/common';
import { SnsService } from './providers/aws-sns/sns.service';
import { TwilioService } from './providers/twilio/twilio.service';
import { SMSFactory } from './sms.factory';

@Module({
  providers: [TwilioService, SnsService, SMSFactory],
  exports: [SMSFactory]
})
export class SMSModule {}
