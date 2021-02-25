import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

var AWS = require('aws-sdk');

@Injectable()
export class SnsService implements SMS {
  phoneNumber: string;
  message: string;
  constructor(private readonly config: ConfigService) { }

  private accessKeyId = this.config.get('AWS_ACCESS_KEY_ID');
  private secretAccessKey = this.config.get('AWS_SECRET_ACCESS_KEY');
  private region = this.config.get('AWS_REGION');
  private subject = this.config.get('AWS_SUBJECT');

  async sendSMS(phoneNumber: string, message: string): Promise<void> {
    this.phoneNumber = phoneNumber;
    this.message = message;

    AWS.config.update({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      region: this.region
    });

    const params = {
      Message: message,
      PhoneNumber: phoneNumber,
      MessageAttributes: {
        'AWS.SNS.SMS.SenderID': {
          DataType: 'String',
          StringValue: this.subject
        }
      }
    };

    try {
      const publishTextPromise = await new AWS.SNS({ apiVersion: '2010-03-31' })
        .publish(params)
        .promise();
      console.log(JSON.stringify({ MessageID: publishTextPromise.MessageId }));
    } catch (error) {
      console.log(JSON.stringify({ Error: error }));
    }
  }
}
