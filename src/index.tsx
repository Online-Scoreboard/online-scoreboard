import React from 'react';
import { render } from 'react-dom';
import dotenv from 'dotenv';
import ApolloClient, { Operation, InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import Amplify, { Auth } from 'aws-amplify';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import * as serviceWorker from './serviceWorker';
import { AMPLIFY, API_URL, APP_NAME } from './config';
import { ProvideAuth } from './components/Auth/Auth.Provider';
import { App } from './App';
import theme from './theme';

dotenv.config();
Amplify.configure(AMPLIFY);

const cache = new InMemoryCache();
const uri = `${API_URL}/graphql`;

cache.writeData({
  data: {
    appName: APP_NAME,
  },
});

const client = new ApolloClient({
  uri,
  fetchOptions: {
    credentials: 'include',
  },
  request: async (operation: Operation): Promise<void> => {
    const session = await Auth.currentSession();
    const token = session.getAccessToken().getJwtToken();

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

const ApolloApp = (AppComponent: React.ComponentType): JSX.Element => (
  <ThemeProvider theme={theme}>
    <ApolloProvider client={client}>
      <ProvideAuth>
        <CssBaseline />
        <AppComponent />
      </ProvideAuth>
    </ApolloProvider>
  </ThemeProvider>
);

render(ApolloApp(App), document.getElementById('root'));

serviceWorker.unregister();
