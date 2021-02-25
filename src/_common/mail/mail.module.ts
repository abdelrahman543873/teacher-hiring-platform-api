import { Module, DynamicModule, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { MailService } from './mail.service';
import { CompilerService } from './compiler.service';
import { VueCompiler } from './compilers/vue-compiler.service';
import { MjMLCompiler } from './compilers/mjml-compiler.service';
import { GeneralOptions } from './mail.type';

@Global()
@Module({})
export class MailModule {
  static forRoot(options: GeneralOptions = {}): DynamicModule {
    return {
      module: MailModule,
      imports: [
        BullModule.registerQueue({
          name: 'mail'
        })
      ],
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options
        },
        MailService,
        CompilerService,
        VueCompiler,
        MjMLCompiler
      ],
      exports: [MailService]
    };
  }
}
