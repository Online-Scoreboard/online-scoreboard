import React from 'react';
import { render } from 'react-dom';
import dotenv from 'dotenv';
import ApolloClient, { Operation, InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import Amplify, { Auth } from 'aws-amplify';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import * as serviceWorker from './serviceWorker';
import { AMPLIFY, API_URL, APP_NAME, APP_VERSION } from './config';
import { notificationInitialState } from './components/Notification';
import { App } from './components/App';
import theme from './theme';
import { AuthHost } from './hooks/Auth';

dotenv.config();
Amplify.configure(AMPLIFY);

const rootState = {
  data: {
    appName: APP_NAME,
    ...notificationInitialState,
  },
};

const cache = new InMemoryCache();
const uri = `${API_URL}/graphql`;

cache.writeData(rootState);

const client = new ApolloClient({
  uri,
  fetchOptions: {
    credentials: 'include',
  },
  request: async (operation: Operation): Promise<void> => {
    const session = await Auth.currentSession();
    const token = await session.getAccessToken().getJwtToken();

    operation.setContext({
      headers: {
        authorization: token,
      },
    });
  },
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

const AppWrapper = (AppComponent: React.ComponentType): JSX.Element => (
  <ThemeProvider theme={theme}>
    <ApolloProvider client={client}>
      <AuthHost />
      <CssBaseline />
      <AppComponent />
    </ApolloProvider>
  </ThemeProvider>
);

render(AppWrapper(App), document.getElementById('root'));

serviceWorker.unregister();

console.log(`Online Scoreboard v.${APP_VERSION}`);
