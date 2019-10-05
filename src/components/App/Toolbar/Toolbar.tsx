import React, { memo, useCallback } from 'react';
import { Link, navigate } from '@reach/router';
import {
  Toolbar as MaterialToolbar,
  Button,
  Link as LinkButton,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { Avatar } from 'react-avataaars';

import useStyles from './Toolbar.styles';

interface ToolbarProps {
  isLoggedIn: boolean;
  user?: any;
  onLogOut: () => void;
}

const ToolbarComponent: React.FC<ToolbarProps> = ({ isLoggedIn, onLogOut, user }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLogOut = useCallback(() => {
    handleClose();
    onLogOut();
  }, [handleClose, onLogOut]);

  const handleProfile = useCallback(() => {
    handleClose();
    navigate('profile');
  }, [handleClose]);

  const handleAccount = useCallback(() => {
    handleClose();
    navigate('account');
  }, [handleClose]);

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
          <>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              size="small"
              onClick={handleMenu}
            >
              <div className={classes.avatarWrapper}>
                <Avatar size="40px" hash={user.avatar || user.username} className={classes.avatarIcon} />
              </div>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleAccount}>My account</MenuItem>
              <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
            </Menu>
          </>
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
