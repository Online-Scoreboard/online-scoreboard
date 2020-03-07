import React, { useEffect, useCallback, memo } from 'react';
import { navigate } from '@reach/router';
import { AppBar, Box } from '@material-ui/core';

import { PrivateRouter } from '../../PrivateRouter';
import { useNotification, Notification } from '../Notification';
import { useMessage } from '../../hooks/useMessage';
import { useAuth } from '../../hooks/Auth';
import { Loading } from '../Loading';
import { Toolbar } from './Toolbar';
import { Footer } from './Footer';
import useAppStyles from './App.styles';

const AppComponent: React.FC = () => {
  const classes = useAppStyles();
  const { body, variant: messageVariant } = useMessage();
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

  useEffect(() => {
    if (body) {
      openNotification(body, messageVariant);
    }
  }, [body, messageVariant, openNotification]);

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
    <Box className={`${classes.root} App`}>
      <Notification message={message} open={open} variant={variant} />
      <AppBar position="static" color="primary" elevation={0} className={classes.appBar}>
        <Toolbar isLoggedIn={isLoggedIn} onLogOut={onLogOut} user={user} />
      </AppBar>

      <Box className={`${classes.root} AppContent`}>
        <PrivateRouter user={user} isLoggedIn={isLoggedIn} confirmEmail={confirmEmail} />
      </Box>

      <Footer />
    </Box>
  );
};

export const App = memo(AppComponent);
