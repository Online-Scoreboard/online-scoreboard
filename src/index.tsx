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
import theme from './theme';
import useAppStyles from './App.styles';

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
      async user(): Promise<void> {
        let user;
        const data = {
          user: {
            __typename: 'UserSession',
            isLoggedIn: false,
            username: '',
          },
        };
        try {
          user = await Auth.currentUserInfo();
          data.user.isLoggedIn = true;
          data.user.username = user.username;
        } catch (err) {
          data.user.isLoggedIn = false;
        }

        cache.writeData({ data });
      },
    },
    // Mutation: {
    //   async signOut(_, args, { cache }) {
    //     await signOut();
    //     return null;
    //   },
    // },
  },
});

const App: React.FC = () => {
  useAppStyles();

  return <h1>{APP_NAME}</h1>;
};

const ApolloApp = (AppComponent: React.ComponentType): JSX.Element => (
  <ThemeProvider theme={theme}>
    <ApolloProvider client={client}>
      <CssBaseline />
      <AppComponent />
    </ApolloProvider>
  </ThemeProvider>
);

render(ApolloApp(App), document.getElementById('root'));

serviceWorker.unregister();
