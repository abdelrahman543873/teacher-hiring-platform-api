import * as twilio from 'twilio';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwilioService implements SMS {
  phoneNumber: string;
  message: string;
  constructor(private readonly config: ConfigService) { }

  private twilioAccountSid = this.config.get('TWILIO_SID');
  private twilioToken = this.config.get('TWILIO_TOKEN');
  private twilioNumber = this.config.get('TWILIO_NUMBER');

  public client = twilio(this.twilioAccountSid, this.twilioToken);

  async sendSMS(phoneNumber: string, message: string): Promise<void> {
    this.phoneNumber = phoneNumber;
    this.message = message;
    await this.client.messages.create({
      to: phoneNumber,
      body: message,
      from: this.twilioNumber
    });
  }
}
