import React, { useEffect, useCallback, memo } from 'react';
import { navigate } from '@reach/router';
import { AppBar } from '@material-ui/core';

import { PrivateRouter } from '../PrivateRouter';
import { useNotification, Notification } from '../Notification';
import { Loading } from '../Loading';
import { useAuth } from '../Auth/useAuth';
import { Toolbar } from './Toolbar';
import { Footer } from './Footer';

import useAppStyles from './App.styles';

const AppComponent: React.FC = () => {
  const classes = useAppStyles();
  const { isLoggedIn, confirmEmail, logOut, loading, error, info, success } = useAuth();
  const { open, variant, message, openNotification, dismissNotification } = useNotification();

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
      <Notification message={message} open={open} variant={variant} handleClose={dismissNotification} />
      <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
        <Toolbar isLoggedIn={isLoggedIn} onLogOut={onLogOut} />
      </AppBar>

      <PrivateRouter isLoggedIn={isLoggedIn} confirmEmail={confirmEmail} />

      <Footer />
    </div>
  );
};

export const App = memo(AppComponent);
