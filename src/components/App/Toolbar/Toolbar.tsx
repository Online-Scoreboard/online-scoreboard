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
          <LinkButton className="pageTitle" variant="h6" component="span" color="textPrimary">
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
              className="userMenu"
              onClick={handleMenu}
            >
              <div className={classes.avatarWrapper}>
                <Avatar size="40px" hash={user.avatar} className={classes.avatarIcon} />
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
              <MenuItem className="profile" onClick={handleProfile}>
                Profile
              </MenuItem>
              <MenuItem className="account" onClick={handleAccount}>
                My account
              </MenuItem>
              <MenuItem className="logOut" onClick={handleLogOut}>
                Log Out
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button variant="outlined" href="/login" className={`${classes.link} logIn`}>
            Log in
          </Button>
        )}
      </nav>
    </MaterialToolbar>
  );
};

export const Toolbar = memo(ToolbarComponent);
