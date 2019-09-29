import React, { memo } from 'react';
import { Router, RouteComponentProps } from '@reach/router';
import { LogIn } from './LogIn';
import { Register } from './Register';
import { NotFound } from '../NotFound';
import { VerifyEmail } from './VerifyEmail';

const Home: React.FC<RouteComponentProps> = () => <div>Home</div>;

interface AuthProps extends RouteComponentProps {
  confirmEmail: boolean;
  email?: string;
}

const AuthComponent: React.FC<AuthProps> = ({ confirmEmail }) => {
  if (confirmEmail) {
    return <VerifyEmail />;
  }

  return (
    <Router>
      <Home path="/" />
      <LogIn path="login" />
      <Register path="register" />
      <NotFound default />
    </Router>
  );
};

export const Auth = memo(AuthComponent);
