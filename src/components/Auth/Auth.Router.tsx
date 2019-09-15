import React from 'react';
import { Router, RouteComponentProps } from '@reach/router';
import { LogIn } from './LogIn';
import { NotFound } from '../../NotFound';

const Home: React.FC<RouteComponentProps> = () => <div>Home</div>;

export const Auth: React.FC<RouteComponentProps> = React.memo(() => (
  <Router>
    <Home path="/" />
    <LogIn path="login" />
    <NotFound default />
  </Router>
));
