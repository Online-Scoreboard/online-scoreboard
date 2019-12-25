import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createAuthLink, AuthOptions } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { notificationInitialState } from './components/Notification';
import { Auth } from 'aws-amplify';

import { AMPLIFY, API_URL, APP_NAME } from './config';

const rootState = {
  data: {
    appName: APP_NAME,
    ...notificationInitialState,
  },
};

const cache = new InMemoryCache();

const httpUri = `${API_URL}/graphql`;

const httpLink = createHttpLink({
  uri: httpUri,
});

const auth: AuthOptions = {
  type: 'AMAZON_COGNITO_USER_POOLS',
  jwtToken: async () => {
    const session = await Auth.currentSession();
    const accessToken = await session.getAccessToken();
    return accessToken.getJwtToken();
  },
};

const link = ApolloLink.from([
  createAuthLink({ url: httpUri, region: AMPLIFY.AppSync.region, auth }),
  createSubscriptionHandshakeLink(httpUri, httpLink),
]);

export const client = new ApolloClient({
  link,
  cache,
  resolvers: {
    Query: {
      async appName(launch, args, { cache }): Promise<void> {
        const data = {
          appName: APP_NAME,
          __typename: 'String',
        };
        cache.writeData({ data });
      },
    },
  },
});

cache.writeData(rootState);
