import React, { memo } from 'react';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { Avatar } from 'react-avataaars';

import useStyles from './PlayerAvatar.styles';
import { UserData } from '../Game.types';

interface Props {
  userData: UserData;
  isAcceptedUser: boolean;
  pending?: boolean;
  onAcceptPlayer?: (playerId: string) => void;
  onRejectPlayer?: (playerId: string) => void;
}

const Component: React.FC<Props> = ({ userData, isAcceptedUser, pending, onAcceptPlayer, onRejectPlayer }) => {
  const [menuStatus, setMenuStatus] = React.useState(null);
  const { avatarWrapper, avatarIcon, pendingAvatarWrapper, pendingPlayer, playerAvatar } = useStyles();

  const handleCloseMenu = () => {
    setMenuStatus(null);
  };

  const handleMenu = (event: React.MouseEvent<any>) => {
    setMenuStatus(event.currentTarget);
  };

  const handleAcceptPlayer = (event: React.MouseEvent<any>) => {
    onAcceptPlayer && onAcceptPlayer(userData.id);
    handleCloseMenu();
  };

  const handleRejectPlayer = (event: React.MouseEvent<any>) => {
    onRejectPlayer && onRejectPlayer(userData.id);
    handleCloseMenu();
  };

  return (
    <div className={`PlayerAvatar ${playerAvatar}`}>
      {pending ? (
        (isAcceptedUser && (
          <>
            <IconButton
              aria-label="pending player"
              aria-controls={`pending-player-${userData.id}-menu`}
              aria-haspopup="true"
              color="inherit"
              size="small"
              className={`pendingPlayer pendingPlayer-${userData.id}`}
              onClick={handleMenu}
            >
              <div
                className={`avatarWrapper pendingAvatarWrapper pendingAvatarWrapper-${userData.id} ${avatarWrapper} ${pendingAvatarWrapper}`}
              >
                <Avatar size="40px" hash={userData.avatar} className={avatarIcon} />
                <span className={pendingPlayer} />
              </div>
            </IconButton>
            <Menu
              id={`pending-player-${userData.id}-menu`}
              anchorEl={menuStatus}
              open={Boolean(menuStatus)}
              onClose={handleCloseMenu}
              keepMounted
            >
              <MenuItem onClick={handleAcceptPlayer}>Accept player</MenuItem>
              <MenuItem onClick={handleRejectPlayer}>Reject player</MenuItem>
            </Menu>
          </>
        )) || (
          <div
            className={`avatarWrapper pendingAvatarWrapper pendingAvatarWrapper-${userData.id} ${avatarWrapper} ${pendingAvatarWrapper}`}
          >
            <Avatar size="40px" hash={userData.avatar} className={avatarIcon} />
            <span className={pendingPlayer} />
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

export const PlayerAvatar = memo(Component);
