import React from 'react';
import { Router, Link } from '@reach/router';
import { Typography, AppBar, Toolbar, Button, Link as LinkButton } from '@material-ui/core';

import { Auth } from './components/Auth/Auth';
import { useAuth } from './components/Auth/Auth.Provider';
import { Home } from './components/Home';
import { Footer } from './components/Footer';

import useAppStyles from './App.styles';

interface PrivateRouterProps {
  isLoggedIn: boolean;
}

const PrivateRouter: React.FC<PrivateRouterProps> = ({ isLoggedIn }) => {
  if (isLoggedIn) {
    return (
      <Router>
        <Home default />
      </Router>
    );
  }

  return (
    <Router>
      <Auth path="*" />
    </Router>
  );
};

export const App: React.FC = () => {
  const classes = useAppStyles();
  const { isLoggedIn, logOut } = useAuth();

  return (
    <div className={classes.root}>
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
};
