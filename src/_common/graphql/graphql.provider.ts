import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql';
import { User } from 'src/user/models/user.model';
import { Request } from 'express';
import { HelperService } from '../utils/helper.service';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(private readonly helperSerivce: HelperService) { }

  createGqlOptions(): GqlModuleOptions {
    return {
      playground: true,
      introspection: true,
      tracing: true,
      debug: true,
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
      context: async ({ req, connection }) => {
        let currentUser: User;

        // Auth for subscription connections
        if (connection && connection.context) currentUser = connection.context.currentUser;
        else currentUser = await this.helperSerivce.getCurrentUser(<Request>req);

        // Get lang and country (if exist)
        const locale = this.helperSerivce.getLocale(req);
        return { req, currentUser, lang: locale.lang, country: locale.country };
      },
      uploads: {
        maxFileSize: 100 * 1024 * 1024, // Max file size: 4 MG
        maxFiles: 10
      },
      subscriptions: {
        keepAlive: 5000,
        onConnect: async connectionParams => {
          if (connectionParams) {
            const req = { headers: connectionParams };
            return {
              currentUser: await this.helperSerivce.getCurrentUser(<Request>req)
            };
          }
        },
        onDisconnect() { }
      }
    };
  }
}
