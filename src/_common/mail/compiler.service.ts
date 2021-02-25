import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { VueCompiler } from './compilers/vue-compiler.service';
import { promises as fs, existsSync } from 'fs';
import * as path from 'path';
import { engineType, GeneralOptions, OptsType } from './mail.type';

@Injectable()
export class CompilerService implements OnModuleInit {
  private engine: engineType = engineType.VUE;
  private path = `${__dirname}/../mail/mails`;
  private fileName = 'default.mjml';

  constructor(
    @Inject('CONFIG_OPTIONS') private readonly opts: GeneralOptions,
    private readonly vueCompiler: VueCompiler
  ) { }

  public onModuleInit() {
    // setup required variables
    if (this.opts.defaultEngine) {
      this.engine = this.opts.defaultEngine;
    }
    if (this.opts.defaultPath) {
      this.path = this.opts.defaultPath;
    }
  }

  public async compile(opts: OptsType): Promise<string> {
    const currentEngine = opts.engine || this.engine;
    const template = await this.getTemplate(opts);
    // factory function chooses what type of compilers to run
    if (currentEngine === engineType.VUE) {
      return await this.vueCompiler.compile(template, opts.data);
    }
  }

  private async getTemplate(opts: OptsType): Promise<string> {
    let template = '';
    if (opts.template) {
      template = opts.template;
    } else if (opts.fileName) {
      const filepath = path.join(this.path, opts.fileName);
      if (!existsSync(filepath)) {
        throw Error(`file not exist check if you create file in the that path => ${this.path}`);
      }
      const buffer = await fs.readFile(filepath);
      template = buffer.toString('utf-8');
    } else if (opts.text) {
      template = opts.text;
    } else {
      const filepath = path.join(this.path, this.fileName);
      if (!existsSync(filepath)) {
        throw Error('error occurred: can not find default mail file');
      }
      const buffer = await fs.readFile(filepath);
      template = buffer.toString('utf-8');
    }
    return template;
  }
}
