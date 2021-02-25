import { HttpException } from '@nestjs/common';
import { LocalizedErrorMessages } from './error-messages';

export class BaseHttpException extends HttpException {
  private static lang: string = 'EN';
  private static message: string = null;
  private static statusCode: number = 600;
  private static errorResponse = LocalizedErrorMessages;

  constructor(lang: string, statusCode: number, message?: string) {
    BaseHttpException.lang = lang;
    BaseHttpException.statusCode = statusCode;
    BaseHttpException.message = message;
    super(BaseHttpException.getLocalizedMessage(), BaseHttpException.statusCode);
  }

  private static getLocalizedMessage() {
    if (BaseHttpException.message) return BaseHttpException.message;
    return BaseHttpException.errorResponse[BaseHttpException.statusCode][BaseHttpException.lang];
  }
}
