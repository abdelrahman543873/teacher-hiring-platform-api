import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as WebSocket from 'ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import ApolloClient from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';

const env = dotenv.parse(fs.readFileSync(path.join(process.cwd(), '.env')));

export let networkInterfaceInstance: SubscriptionClient;

const networkInterface = (auth?: string) => {
  if (!networkInterfaceInstance)
    networkInterfaceInstance = new SubscriptionClient(
      env.API_SUBSCRIPTION_BASE,
      {
        reconnect: true,
        ...(auth && { connectionCallback: () => ({ Authorization: `Bearer ${auth}` }) })
      },
      WebSocket
    );
  return networkInterfaceInstance;
};

export const apollo = (auth?: string) =>
  new ApolloClient({
    link: new WebSocketLink(networkInterface(auth)),
    cache: new InMemoryCache()
  });
