export type OptsType = {
  fileName?: string;
  template?: string;
  data?: Record<string, unknown>;
  text?: string;
  engine?: engineType;
};

export enum engineType {
  VUE = 'vue'
}

export type GeneralOptions = {
  defaultPath?: string;
  defaultEngine?: engineType;
};

export interface MailCompiler {
  compile(template: string, data: Record<string, unknown>): void;
}

export type MailDetails = {
  from?: string;
  to: string;
  subject?: string;
};
