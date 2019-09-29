import React, { memo } from 'react';
import { Link } from '@reach/router';
import { Toolbar as MaterialToolbar, Button, Link as LinkButton, Typography } from '@material-ui/core';

import useStyles from './Toolbar.styles';

interface ToolbarProps {
  isLoggedIn: boolean;
  onLogOut: () => void;
}

const ToolbarComponent: React.FC<ToolbarProps> = ({ isLoggedIn, onLogOut }) => {
  const classes = useStyles();

  return (
    <MaterialToolbar className={classes.toolbar}>
      <Typography variant="h6" noWrap className={classes.toolbarTitle}>
        <Link to="/">
          <LinkButton variant="h6" component="span" color="textPrimary">
            Online Scoreboard
          </LinkButton>
        </Link>
      </Typography>
      <nav>
        {isLoggedIn ? (
          <Button color="inherit" variant="outlined" className={classes.link} onClick={onLogOut}>
            Log out
          </Button>
        ) : (
          <>
            <Link to="/About">
              <LinkButton variant="button" component="span" color="textPrimary" className={classes.link}>
                About
              </LinkButton>
            </Link>

            <Link to="/Features">
              <LinkButton variant="button" component="span" color="textPrimary" className={classes.link}>
                Features
              </LinkButton>
            </Link>

            <Button variant="outlined" href="/login" className={classes.link}>
              Log in
            </Button>
          </>
        )}
      </nav>
    </MaterialToolbar>
  );
};

export const Toolbar = memo(ToolbarComponent);
