import React, { memo } from 'react';
import { Grid, Typography } from '@material-ui/core';

import { UserAvatar } from '../UserAvatar/UserAvatarComponent';
import { GameUserData } from '../Game.types';

interface Props {
  users: GameUserData[];
  pendingUsers: GameUserData[];
  isAcceptedUser: boolean;
  onAcceptUser: (user: string) => void;
  onRejectUser: (user: string) => void;
}

const Component: React.FC<Props> = ({ users, pendingUsers, isAcceptedUser, onAcceptUser, onRejectUser }) => (
  <Grid container direction="row" spacing={1} alignItems="center" className="GameUsers">
    <Typography>Users connected</Typography>
    {users &&
      users.map(
        ({ id, item }) =>
          item && (
            <Grid item key={`game-user-${id}`}>
              <UserAvatar userData={item} isAcceptedUser={isAcceptedUser} />
            </Grid>
          )
      )}
    {pendingUsers &&
      pendingUsers.map(
        ({ id, item }) =>
          item && (
            <Grid item key={`pending-user-${id}`}>
              <UserAvatar
                userData={item}
                isAcceptedUser={isAcceptedUser}
                onAcceptUser={onAcceptUser}
                onRejectUser={onRejectUser}
                pending
              />
            </Grid>
          )
      )}
  </Grid>
);

export const Users = memo(Component);
