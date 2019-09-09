import React from 'react';
import { Router } from '@reach/router';
import { Auth } from './components/Auth/Auth';
import { Home } from './components/Home';

export interface PrivateRouterProps {
  isLoggedIn: boolean;
}

export const PrivateRouter: React.FC<PrivateRouterProps> = React.memo(({ isLoggedIn }) => {
  if (isLoggedIn) {
    return (
      <Router>
        <Home path="*" />
      </Router>
    );
  }
  return (
    <Router>
      <Auth path="*" />
    </Router>
  );
});
