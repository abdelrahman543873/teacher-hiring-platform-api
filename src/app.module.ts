import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './_common/database/database.module';
import { GraphQLModule } from '@nestjs/graphql';
import { LoggerModule } from './_common/logger/logger.module';
import { UploaderModule } from './_common/uploader/uploader.module';
import { APP_PIPE, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { PubSub } from './_common/graphql/graphql.pubsub';
import { PinoLogger } from 'nestjs-pino';
import { GqlResponseInterceptor } from './_common/graphql/graphql-response.interceptor';
import { ValidationPipe } from './_common/exceptions/validation.pipe';
import { Timestamp } from './_common/graphql/timestamp.scalar';
import { JSON } from './_common/graphql/json.scalar';
import { ScheduleModule } from '@nestjs/schedule';
import { PusherModule } from './_common/pusher/pusher.module';
import { AuthModule } from './auth/auth.module';
import { GqlConfigService } from './_common/graphql/graphql.provider';
import { AuthService } from './auth/auth.service';
import { NotificationModule } from './notification/notification.module';
import { SecurityGroupModule } from './security-group/security-group.module';
import { UserModule } from './user/user.module';
import { MailModule } from './_common/mail/mail.module';
import { engineType } from './_common/mail/mail.type';
import { BullModule } from '@nestjs/bull';
import { dirname } from 'path';
import { SMSModule } from './_common/sms/sms.module';
import { GqlExceptionFilter } from './_common/exceptions/gql-exception-filter';
import { HttpExceptionFilter } from './_common/exceptions/http-exception-filter';
import { TeacherModule } from './teacher/teacher.module';
import { SchoolModule } from './school/school.module';
import { HelperModule } from './_common/utils/helper.module';
import { AppConfigurationModule } from './app-configuration/app-configuration.module';
import { CurriculumModule } from './curriculum/curriculum.module';
import { SubjectModule } from './subject/subject.module';
import { FilesReferencesChecking } from './_common/jobs/files-references-checking';
import { TestingResolversModule } from './testing-resolvers/testing-resolvers.module';
import { UserUpdatesModule } from './user-updates/user-updates.module';
import { HelperService } from './_common/utils/helper.service';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot(),
    ServeStaticModule.forRoot({ rootPath: 'public' }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    PusherModule,
    SubjectModule,
    UploaderModule,
    NotificationModule,
    SecurityGroupModule,
    AuthModule,
    UserModule,
    SMSModule,
    CurriculumModule,
    HelperModule,
    TeacherModule,
    SchoolModule,
    TestingResolversModule,
    AppConfigurationModule,
    GraphQLModule.forRootAsync({
      imports: [SMSModule, HelperModule, UserModule, DatabaseModule],
      useClass: GqlConfigService,
      inject: [HelperService]
    }),
    MailModule.forRoot({
      defaultEngine: engineType.VUE,
      defaultPath: `${dirname}/../mails/`
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: +configService.get('REDIS_PORT')
        }
      }),
      inject: [ConfigService]
    }),
    UserUpdatesModule,
    ChatModule
  ],
  providers: [
    PubSub,
    Timestamp,
    FilesReferencesChecking,
    JSON,
    { provide: APP_PIPE, useClass: ValidationPipe },
    { provide: APP_FILTER, useClass: GqlExceptionFilter },
    HttpExceptionFilter,
    {
      provide: APP_INTERCEPTOR,
      useFactory: (logger: PinoLogger) => new GqlResponseInterceptor(logger),
      inject: [PinoLogger]
    }
  ]
})
export class AppModule {}
