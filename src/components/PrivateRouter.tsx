import React from 'react';
import { Router, Redirect, RouteComponentProps } from '@reach/router';
import { Auth } from './Auth';
import { Home } from './Home';

export interface PrivateRouterProps {
  isLoggedIn: boolean;
}

const NotFound: React.FC<RouteComponentProps> = () => <Redirect noThrow to="/home" />;

export const PrivateRouter: React.FC<PrivateRouterProps> = React.memo(({ isLoggedIn }) => {
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
      <Auth path="*" />
    </Router>
  );
});
