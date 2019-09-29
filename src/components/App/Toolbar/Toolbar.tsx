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
          <LinkButton variant="button" component="span" underline="hover" color="textPrimary" className={classes.link}>
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
    </MaterialToolbar>
  );
};

export const Toolbar = memo(ToolbarComponent);
