import React, { memo, useEffect, useState, useCallback } from 'react';
import { Typography, Button, CircularProgress } from '@material-ui/core';

import { User } from '../../hooks/Auth';
import { Game } from './Game.types';
import useStyles from './Game.styles';
import { StaticNotification } from '../StaticNotification';
import { usePendingPlayers } from './usePendingPlayers';

interface Props {
  gameData: Game;
  user: User;
  operationLoading: boolean;
  startGame: () => void;
  joinGame: () => void;
  acceptPlayer: (playerId: string) => void;
}

const Component: React.FC<Props> = ({ gameData, user, startGame, joinGame, acceptPlayer, operationLoading }) => {
  const { id, owner, status, users = [], pendingPlayers = [] } = gameData;
  const userId = user.id || '';

  const { loader } = useStyles();
  const [staticMessage, setStaticMessage] = useState('');
  const {
    pendingPlayer,
    dismissedPendingPlayers,
    dismissPendingPlayer,
    isAcceptedUser,
    isPendingUser,
  } = usePendingPlayers(pendingPlayers, users, userId);

  useEffect(() => {
    if (!pendingPlayer) {
      setStaticMessage('');
    }
    if (pendingPlayer.id) {
      setStaticMessage(`Player "${pendingPlayer.name}" wants to join the game`);
    } else if (staticMessage) {
      setStaticMessage('');
    }
  }, [pendingPlayer, staticMessage]);

  const dismissNotification = useCallback(async () => {
    dismissPendingPlayer([...dismissedPendingPlayers, pendingPlayer.id]);
  }, [dismissPendingPlayer, dismissedPendingPlayers, pendingPlayer.id]);

  return (
    <div className="Game">
      <StaticNotification
        message={staticMessage}
        open={Boolean(staticMessage)}
        handleOk={() => acceptPlayer(pendingPlayer.id)}
        handleCancel={dismissNotification}
      />

      <div>
        <Typography>Game id: {id}</Typography>
        <Typography>Game creator: {owner}</Typography>
        <Typography>Game status: {status}</Typography>
        <Typography>users connected:</Typography>
        <ul>{users && users.map(({ id, item }) => <li key={`user-${id}`}>{item && item.username}</li>)}</ul>
        <Typography>Pending Players:</Typography>
        <ul>
          {pendingPlayers &&
            pendingPlayers.map(({ id, item }) => <li key={`pending-player-${id}`}>{item && item.username}</li>)}
        </ul>
      </div>
      <div>
        {isAcceptedUser() && status === 'new' ? (
          <Button disabled={operationLoading} onClick={startGame}>
            {operationLoading && <CircularProgress size={24} className={loader} />}
            Start Game
          </Button>
        ) : null}
        {!isAcceptedUser() && !isPendingUser() ? (
          <Button disabled={operationLoading} onClick={joinGame}>
            {operationLoading && <CircularProgress size={24} className={loader} />}
            Join Game
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export const GameComponent = memo(Component);
