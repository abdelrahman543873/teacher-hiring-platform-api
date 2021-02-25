import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { PinoLogger } from 'nestjs-pino';
import { DatabaseError } from 'sequelize';
import { IGqlErrorResponse } from 'src/_common/graphql/graphql-response.type';

@Catch()
export class GqlExceptionFilter implements ExceptionFilter {
  private response = {
    code: 500,
    success: false,
    message: 'Something went wrong!'
  };

  constructor(private readonly logger: PinoLogger) {}

  catch(exception: unknown, host: ArgumentsHost): IGqlErrorResponse {
    console.log(exception);
    if (exception instanceof HttpException) {
      const gqlHost = GqlArgumentsHost.create(host);
      const currentGqlInfo = gqlHost.getInfo();
      const currentGqlCtx = gqlHost.getContext();
      const message = exception.getResponse() as any;

      this.logGqlMessage(currentGqlCtx, currentGqlInfo, exception);
      this.response.code = exception.getStatus();
      this.response.message = this.formatMessage(message);
      return this.response;
    }
    if (exception instanceof DatabaseError) {
      this.response.code = 500;
      this.response.message = exception.message;
      this.logger.error(
        `Message: ${exception.message} `,
        `\n\n\n\n\n\n Stack: ${exception.stack} `,
        `\n\n\n\n\n\n SQL: ${exception.sql} `,
        '\n\n\n\n\n\n'
      );
      return this.response;
    }

    this.logger.error('Error', exception);
    this.response.code = 500;
    this.response.message = 'Something went wrong!';
    return this.response;
  }

  private logGqlMessage(currentGqlInfo, currentGqlCtx, exception) {
    this.logger.setContext(`${GqlExceptionFilter.name} - ${currentGqlInfo.fieldName} `);
    const trace = `Operation body: ${
      currentGqlCtx.req ? JSON.stringify(currentGqlCtx.req.body) : 'None'
    }
      Current user: ${currentGqlCtx.currentUser ? currentGqlCtx.currentUser.id : 'No user'} `;
    if (typeof exception === 'object') {
      this.logger.error(`Message: ${exception.response}\nStack: ${trace} `, '\n\n\n\n\n\n');
    } else {
      this.logger.error(`Message: ${exception} \n Stack: ${trace} `, '\n\n\n\n\n\n');
    }
  }

  private formatMessage(message: Record<string, any> | string): string {
    if (typeof message === 'object') {
      message = JSON.stringify(message.message);
    }
    return message;
  }
}
