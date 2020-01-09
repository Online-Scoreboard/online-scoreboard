import React from 'react';
import { render } from 'react-dom';
import dotenv from 'dotenv';
import { ApolloProvider } from '@apollo/react-hooks';
import Amplify from 'aws-amplify';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import theme from './theme';
import { AMPLIFY, APP_VERSION } from './config';
import { App } from './components/App';
import { AuthHost } from './hooks/Auth';
import { MessageHost } from './hooks/useMessage';
import { client } from './apolloClient';
import * as serviceWorker from './serviceWorker';

dotenv.config();
Amplify.configure(AMPLIFY);

const AppWrapper = (AppComponent: React.ComponentType): JSX.Element => (
  <ThemeProvider theme={theme}>
    <ApolloProvider client={client}>
      <AuthHost />
      <MessageHost />
      <CssBaseline />
      <AppComponent />
    </ApolloProvider>
  </ThemeProvider>
);

render(AppWrapper(App), document.getElementById('root'));

serviceWorker.unregister();

console.log(`Online Scoreboard v.${APP_VERSION}`);
