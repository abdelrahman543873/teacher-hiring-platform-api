import { Injectable } from '@nestjs/common';

const Vue = require('vue');
import { createRenderer } from 'vue-server-renderer';
import { MailCompiler } from '../mail.type';
import { MjMLCompiler } from './mjml-compiler.service';

@Injectable()
export class VueCompiler implements MailCompiler {
  constructor(private MjMLCompiler: MjMLCompiler) {}
  public async compile(template: string, data: Record<string, unknown> = {}): Promise<string> {
    const app = new Vue({
      template,
      data
    });
    const renderer = createRenderer({
      template: '<!--vue-ssr-outlet-->'
    });
    const html = await renderer.renderToString(app);
    const string = await this.MjMLCompiler.compile(html);
    return string;
  }
}
