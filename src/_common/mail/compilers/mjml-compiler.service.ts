import { Injectable } from '@nestjs/common';
import * as mjml2html from 'mjml';
import { MailCompiler } from '../mail.type';

@Injectable()
export class MjMLCompiler implements MailCompiler {
  public compile(template: string): string {
    const { html, errors } = mjml2html(template, { juicePreserveTags: true });
    if (errors.length) {
      throw new Error(errors[0]);
    }
    return html;
  }
}
