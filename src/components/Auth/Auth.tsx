import React from 'react';
import { Router, RouteComponentProps } from '@reach/router';
import { LogIn } from './LogIn';
import { NotFound } from '../../NotFound';

const Home: React.FC<RouteComponentProps> = () => <div>Home</div>;

export const Auth: React.FC<RouteComponentProps> = () => (
  <Router>
    <Home path="/" />
    <LogIn path="login" />
    <LogIn path="register" />
    <NotFound default />
  </Router>
);
