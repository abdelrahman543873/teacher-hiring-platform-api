import * as pino from 'pino';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import * as pinoms from 'pino-multi-stream';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { Module } from '@nestjs/common';
import { createWriteStream } from 'pino-sentry';
import { ConfigService } from '@nestjs/config';

@Module({})
export class LoggerModule {
  static forRoot() {
    return {
      global: true,
      module: LoggerModule,
      exports: [PinoLoggerModule],
      imports: [
        PinoLoggerModule.forRootAsync({
          providers: [ConfigService],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => {
            return {
              pinoHttp: [
                {
                  name: 'Pino',
                  level: config.get('NODE_ENV') !== 'production' ? 'warn' : 'info',
                  timestamp: () => `, "Time": "${new Date().toISOString()}"`,
                  redact: ['password', 'headers.cookie'],
                  safe: true,
                  enabled: true,
                  prettyPrint: {
                    colorize: true,
                    levelFirst: true,
                    crlf: true
                  },
                  serializers: {
                    err: pino.stdSerializers.err,
                    req: pino.stdSerializers.req,
                    res: pino.stdSerializers.res
                  },
                  useLevel: config.get('NODE_ENV') !== 'production' ? 'debug' : 'info',
                  genReqId: req => req.id || uuid.v4(),
                  autoLogging: false,
                  ...(config.get('NODE_ENV') === 'production' && {
                    logger: pinoms({
                      streams: [
                        { stream: process.stdout },
                        {
                          stream: fs.createWriteStream(path.join(process.cwd(), 'logs/logs.out'))
                        },
                        {
                          stream: createWriteStream({
                            dsn: config.get('SENTRY_DNS'),
                            serverName: config.get('SERVER_NAME')
                          })
                        }
                      ]
                    })
                  })
                },
                process.stdout
              ]
            };
          }
        })
      ]
    };
  }
}
