import React, { useEffect, useCallback } from 'react';
import { Link, navigate } from '@reach/router';
import { Typography, AppBar, Toolbar, Button, Link as LinkButton } from '@material-ui/core';

import { PrivateRouter } from '../PrivateRouter';
import { useNotification, Notification } from '../Notification';
import { Loading } from '../Loading';
import { useAuth } from '../Auth/useAuth';
import { Footer } from '../Footer';

import useAppStyles from './App.styles';

export const App: React.FC = React.memo(() => {
  const classes = useAppStyles();
  const { isLoggedIn, logOut, loading, error, success } = useAuth();
  const { open, variant, message, openNotification, dismissNotification } = useNotification();

  useEffect(() => {
    if (error) {
      openNotification(error, 'error');
    }

    if (success) {
      openNotification(success, 'success');
    }
  }, [error, success, openNotification]);

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
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" noWrap className={classes.toolbarTitle}>
            Online Scoreboard
          </Typography>
          <nav>
            <Link to="/features">
              <LinkButton variant="button" component="span" color="textPrimary" className={classes.link}>
                Features
              </LinkButton>
            </Link>

            <Link to="/enterprise">
              <LinkButton variant="button" component="span" color="textPrimary" className={classes.link}>
                Enterprise
              </LinkButton>
            </Link>

            <Link to="/support">
              <LinkButton
                variant="button"
                component="span"
                underline="hover"
                color="textPrimary"
                className={classes.link}
              >
                Support
              </LinkButton>
            </Link>
          </nav>
          {isLoggedIn ? (
            <Button color="primary" variant="outlined" className={classes.link} onClick={onLogOut}>
              Log out
            </Button>
          ) : (
            <Button color="primary" variant="outlined" href="/login" className={classes.link}>
              Log in
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <PrivateRouter isLoggedIn={isLoggedIn} />

      <Footer />
    </div>
  );
});
