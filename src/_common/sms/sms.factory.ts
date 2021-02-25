import { Injectable } from "@nestjs/common";
import { SnsService } from "./providers/aws-sns/sns.service";
import { TwilioService } from "./providers/twilio/twilio.service";

export enum SMSProviderType{
    TWILLIO = 'TWILLIO',
    AMAZON = 'AMAZON'
}

@Injectable()
export class SMSFactory {
    constructor(
        private readonly snsService: SnsService,
        private readonly twillioService: TwilioService
    ){}
    async sendSMS(type: SMSProviderType, phoneNumber: string, message: string): Promise<void> {
        let provider = (type === 'TWILLIO') ? this.twillioService : this.snsService
        return provider.sendSMS(phoneNumber, message);
    }
}
