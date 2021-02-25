import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response, Request } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { DatabaseError } from 'sequelize';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private defaultResponse = {
    code: 500,
    success: false,
    message: 'Something went wrong!'
  };

  constructor(private readonly logger: PinoLogger) {}

  catch(exception: unknown, host: ArgumentsHost): Response {
    console.log(exception);
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const message = exception.getResponse() as any;
      this.logRestMessage(request, message);
      return response.json({
        message: this.formatMessage(message),
        code: exception.getStatus(),
        success: false
      });
    }
    if (exception instanceof DatabaseError) {
      this.logger.error(
        `Message: ${exception.message} `,
        `\n\n\n\n\n\n Stack: ${exception.stack} `,
        `\n\n\n\n\n\n SQL: ${exception.sql} `,
        '\n\n\n\n\n\n'
      );
      return response.json({
        code: 500,
        message: exception.message,
        response: false
      });
    }
    // unknown Error
    this.logger.error('Error', exception);
    return response.json(this.defaultResponse);
  }

  private logRestMessage(request: Request, message: Record<string, any> | string): void {
    this.logger.setContext(`${HttpExceptionFilter.name}-${request.url}`);
    const trace = `Operation body: ${JSON.stringify(request.body)}`;
    if (typeof message === 'object') {
      this.logger.error(
        `Message: ${message.error} `,
        `\n\n\n\n\n\n Stack: ${trace} `,
        '\n\n\n\n\n\n'
      );
    } else {
      this.logger.error(`Message: ${message} `, `\n\n\n\n\n\n Stack: ${trace} `, '\n\n\n\n\n\n');
    }
  }

  private formatMessage(message: Record<string, any> | string): string {
    if (typeof message === 'object') {
      message = `${message.error} - ${JSON.stringify(message.message)} `;
    }
    return message;
  }
}
