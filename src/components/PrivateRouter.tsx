import React from 'react';
import { Router, Redirect, RouteComponentProps } from '@reach/router';
import { Auth } from './Auth';
import { Home } from './Home';

export interface PrivateRouterProps {
  isLoggedIn: boolean;
  confirmEmail: boolean;
}

const NotFound: React.FC<RouteComponentProps> = () => <Redirect noThrow to="/home" />;

const PrivateRouterComponent: React.FC<PrivateRouterProps> = React.memo(({ isLoggedIn, confirmEmail }) => {
  if (isLoggedIn) {
    return (
      <Router>
        <Home path="/home" />
        <NotFound default />
      </Router>
    );
  }

  return (
    <Router>
      <Auth path="*" confirmEmail={confirmEmail} />
    </Router>
  );
});

export const PrivateRouter = React.memo(PrivateRouterComponent);
