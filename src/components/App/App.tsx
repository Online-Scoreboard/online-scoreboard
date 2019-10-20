import React, { useEffect, useCallback, memo } from 'react';
import { navigate } from '@reach/router';
import { AppBar } from '@material-ui/core';

import { PrivateRouter } from '../PrivateRouter';
import { useNotification, Notification } from '../Notification';
import { useAuth } from '../../hooks/Auth';
import { Loading } from '../Loading';
import { Toolbar } from './Toolbar';
import { Footer } from './Footer';

import useAppStyles from './App.styles';

const AppComponent: React.FC = () => {
  const classes = useAppStyles();
  const { isLoggedIn, confirmEmail, logOut, loading, error, info, success, user } = useAuth();
  const { open, variant, message, openNotification } = useNotification();

  useEffect(() => {
    if (error) {
      openNotification(error, 'error');
    }

    if (info) {
      openNotification(info, 'success');
    }

    if (success) {
      openNotification(success, 'success');
    }
  }, [error, info, success, openNotification]);

  const onLogOut = useCallback(async () => {
    try {
      await logOut();
    } catch (err) {
      return;
    }

    navigate('/');
  }, [logOut]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={`${classes.root} App`}>
      <Notification message={message} open={open} variant={variant} />
      <AppBar position="static" color="primary" elevation={0} className={classes.appBar}>
        <Toolbar isLoggedIn={isLoggedIn} onLogOut={onLogOut} user={user} />
      </AppBar>

      <PrivateRouter isLoggedIn={isLoggedIn} confirmEmail={confirmEmail} />

      <Footer />
    </div>
  );
};

export const App = memo(AppComponent);
