import React, { memo } from 'react';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { Avatar } from 'react-avataaars';

import useStyles from './UserAvatar.styles';
import { UserData } from '../Game.types';

interface Props {
  userData: UserData;
  isAcceptedUser: boolean;
  pending?: boolean;
  onAcceptUser?: (userId: string) => void;
  onRejectUser?: (userId: string) => void;
}

const Component: React.FC<Props> = ({ userData, isAcceptedUser, pending, onAcceptUser, onRejectUser }) => {
  const [menuStatus, setMenuStatus] = React.useState(null);
  const { avatarWrapper, avatarIcon, pendingAvatarWrapper, pendingUser, userAvatar } = useStyles();

  const handleCloseMenu = () => {
    setMenuStatus(null);
  };

  const handleMenu = (event: React.MouseEvent<any>) => {
    setMenuStatus(event.currentTarget);
  };

  const handleAcceptUser = (event: React.MouseEvent<any>) => {
    onAcceptUser && onAcceptUser(userData.id);
    handleCloseMenu();
  };

  const handleRejectUser = (event: React.MouseEvent<any>) => {
    onRejectUser && onRejectUser(userData.id);
    handleCloseMenu();
  };

  return (
    <div className={`UserAvatar ${userAvatar}`}>
      {pending ? (
        (isAcceptedUser && (
          <>
            <IconButton
              aria-label="pending user"
              aria-controls={`pending-user-${userData.id}-menu`}
              aria-haspopup="true"
              color="inherit"
              size="small"
              className={`pendingUser pendingUser-${userData.id}`}
              onClick={handleMenu}
            >
              <div
                className={`avatarWrapper pendingAvatarWrapper pendingAvatarWrapper-${userData.id} ${avatarWrapper} ${pendingAvatarWrapper}`}
              >
                <Avatar size="40px" hash={userData.avatar} className={avatarIcon} />
                <span className={pendingUser} />
              </div>
            </IconButton>
            <Menu
              id={`pending-user-${userData.id}-menu`}
              anchorEl={menuStatus}
              open={Boolean(menuStatus)}
              onClose={handleCloseMenu}
              keepMounted
            >
              <MenuItem onClick={handleAcceptUser}>Accept user</MenuItem>
              <MenuItem onClick={handleRejectUser}>Reject user</MenuItem>
            </Menu>
          </>
        )) || (
          <div
            className={`avatarWrapper pendingAvatarWrapper pendingAvatarWrapper-${userData.id} ${avatarWrapper} ${pendingAvatarWrapper}`}
          >
            <Avatar size="40px" hash={userData.avatar} className={avatarIcon} />
            <span className={pendingUser} />
          </div>
        )
      ) : (
        <div className={`avatarWrapper avatarWrapper-${userData.id} ${avatarWrapper}`}>
          <Avatar size="40px" hash={userData.avatar} className={avatarIcon} />
        </div>
      )}
    </div>
  );
};

export const UserAvatar = memo(Component);
