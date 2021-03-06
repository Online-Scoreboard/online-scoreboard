import React, { memo } from 'react';
import { Router, RouteComponentProps, Redirect } from '@reach/router';
import { LogIn } from './LogIn';
import { Register } from './Register';
import { VerifyEmail } from './VerifyEmail';
import { ForgottenPassword } from './ForgottenPassword';
import { Home } from '../Home';

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
      <LogIn path="/login" />
      <Register path="/register" />
      <ForgottenPassword path="/forgot-password" />
      <Redirect noThrow default from="*" to="/" />
    </Router>
  );
};

export const Auth = memo(AuthComponent);
