import * as nodeMailer from 'nodemailer';
import Mail = require('nodemailer/lib/mailer');
import * as os from 'os';

import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue, Job } from 'bull';
import { InjectQueue, Processor, Process, OnQueueActive } from '@nestjs/bull';

import { CompilerService } from './compiler.service';
import { ConfigService } from '@nestjs/config';
import { OptsType, MailDetails } from './mail.type';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Processor('mail')
@Injectable()
export class MailService implements OnModuleInit {
  private mailer: Mail;

  public constructor(
    private readonly compilerService: CompilerService,
    private readonly configService: ConfigService,
    @InjectQueue('mail') private readonly mailQueue: Queue,
    @InjectPinoLogger('mailJob') private readonly logger: PinoLogger
  ) { }

  public onModuleInit() {
    this.mailer = this.setUpMailer();
  }

  public async sendMail(opts: OptsType, mailDetails: MailDetails): Promise<void> {
    const isProd = this.configService.get('NODE_ENV') === 'production';
    await this.mailQueue.add(
      'mailJob',
      { opts, mailDetails },
      { removeOnComplete: isProd, removeOnFail: isProd }
    );
    return;
  }

  @Process({
    name: 'mailJob',
    concurrency: os.cpus().length
  })
  private async processMailJop(
    job: Job<{ opts: OptsType; mailDetails: MailDetails }>
  ): Promise<void> {
    const html = await this.compilerService.compile(job.data.opts);
    if (!job.data.mailDetails.from) {
      job.data.mailDetails.from = this.configService.get('ADMIN_EMAIL');
    }
    if (!job.data.mailDetails.subject) {
      job.data.mailDetails.subject = this.configService.get('DEFAULT_SUBJECT');
    }
    await this.mailer.sendMail({ ...job.data.mailDetails, html });
    return;
  }

  private setUpMailer(): Mail {
    return nodeMailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS')
      },
      pool: true,
      maxMessages: Infinity,
      secure:
        this.configService.get('NODE_ENV') === 'production' &&
          this.configService.get('MAIL_PORT') === 465
          ? true
          : false, // For ssl
      maxConnections: 1
    });
  }

  @OnQueueActive()
  onActive(job: Job) {
    const isProd = this.configService.get('NODE_ENV') === 'production';
    this.logger[isProd ? 'info' : 'warn'](
      `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}...`
    );
  }
}
