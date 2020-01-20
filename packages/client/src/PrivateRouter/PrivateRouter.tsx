import React, { memo } from 'react';
import { Router, Redirect, RouteComponentProps } from '@reach/router';
import { Auth } from '../components/Auth';
import { Dashboard } from '../components/Dashboard';
import { Profile } from '../components/Profile';
import { NewGame } from '../components/NewGame';
import { Game } from '../components/Game';

interface PrivateRouterProps {
  isLoggedIn: boolean;
  confirmEmail: boolean;
  user?: any;
}

const NotFound: React.FC<RouteComponentProps> = () => <Redirect noThrow to="/home" />;

const PrivateRouterComponent: React.FC<PrivateRouterProps> = React.memo(({ isLoggedIn, confirmEmail, user }) => {
  if (isLoggedIn && user && user.username) {
    return (
      <Router>
        <Dashboard path="/home" />
        <Profile path="/profile" />
        <Dashboard path="/account" />
        <NewGame path="/new-game" />
        <Game path="/game/:gameId" />
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

export const PrivateRouter = memo(PrivateRouterComponent);
