import React, { memo } from 'react';
import { Grid } from '@material-ui/core';

import { PlayerAvatar } from '../PlayerAvatar/PlayerAvatarComponent';
import { GameUserData } from '../Game.types';

interface Props {
  users: GameUserData[];
  pendingPlayers: GameUserData[];
  isAcceptedUser: boolean;
  onAcceptPlayer: (playerId: string) => void;
  onRejectPlayer: (playerId: string) => void;
}

const Component: React.FC<Props> = ({ users, pendingPlayers, isAcceptedUser, onAcceptPlayer, onRejectPlayer }) => {
  const handleAcceptPlayer = (playerId: string) => {
    onAcceptPlayer(playerId);
  };

  const handleRejectPlayer = (playerId: string) => {
    onRejectPlayer(playerId);
  };

  return (
    <Grid container direction="row" spacing={1} alignItems="center" className="GamePlayers">
      {users &&
        users.map(
          ({ id, item }) =>
            item && (
              <Grid item key={`game-player-${id}`}>
                <PlayerAvatar userData={item} isAcceptedUser={isAcceptedUser} />
              </Grid>
            )
        )}
      {pendingPlayers &&
        pendingPlayers.map(
          ({ id, item }) =>
            item && (
              <Grid item key={`pending-player-${id}`}>
                <PlayerAvatar
                  userData={item}
                  isAcceptedUser={isAcceptedUser}
                  onAcceptPlayer={handleAcceptPlayer}
                  onRejectPlayer={handleRejectPlayer}
                  pending
                />
              </Grid>
            )
        )}
    </Grid>
  );
};

export const Players = memo(Component);
