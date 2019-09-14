import React, { useEffect } from 'react';
import { Link } from '@reach/router';
import { Typography, AppBar, Toolbar, Button, Link as LinkButton } from '@material-ui/core';

import { PrivateRouter } from './PrivateRouter';
import { useAuth } from './components/Auth/Auth.Provider';
import { Footer } from './components/Footer';

import useAppStyles from './App.styles';
import { Loading } from './components/Loading';
import { useNotification, Notification } from './components/Notification';

export const App: React.FC = React.memo(() => {
  const classes = useAppStyles();
  const { isLoggedIn, logOut, loading } = useAuth();
  const { open, variant, message } = useNotification();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={classes.root}>
      <Notification message={message} open={open} variant={variant} />
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
            <Button color="primary" variant="outlined" className={classes.link} onClick={logOut}>
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
