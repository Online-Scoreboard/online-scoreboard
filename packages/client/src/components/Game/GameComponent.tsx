import React, { memo, useEffect, useCallback } from 'react';
import { Typography, Button, CircularProgress, Container, Grid } from '@material-ui/core';

import useStyles from './Game.styles';
import { StaticNotification } from '../StaticNotification';
import { usePendingPlayers } from './usePendingPlayers';
import { Share } from './Share';
import { Players } from './Players';
import { useStaticMessage } from '../../hooks/useStaticMessage';
import { User } from '../../hooks/Auth';
import { Game } from './Game.types';

interface Props {
  gameData: Game;
  user: User;
  operationLoading: boolean;
  startGame: () => void;
  joinGame: () => void;
  acceptPlayer: (playerId: string) => void;
  rejectPlayer: (playerId: string) => void;
}

const Component: React.FC<Props> = ({
  gameData,
  user,
  startGame,
  joinGame,
  acceptPlayer,
  rejectPlayer,
  operationLoading,
}) => {
  const { id, name, status, users = [], pendingPlayers = [] } = gameData;
  const userId = user.id || '';

  const { loader, root, content } = useStyles();
  const { staticMessage, setStaticMessage } = useStaticMessage();
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
  }, [pendingPlayer, staticMessage, setStaticMessage]);

  const dismissNotification = useCallback(async () => {
    dismissPendingPlayer([...dismissedPendingPlayers, pendingPlayer.id]);
  }, [dismissPendingPlayer, dismissedPendingPlayers, pendingPlayer.id]);

  const handleAcceptPlayer = (playerId: string) => {
    acceptPlayer(playerId);
  };

  const handleRejectPlayer = (playerId: string) => {
    rejectPlayer(playerId);
    dismissPendingPlayer([...dismissedPendingPlayers, playerId]);
  };

  return (
    <Container component="main" className={`${root} Game`}>
      <StaticNotification
        message={staticMessage}
        open={Boolean(staticMessage)}
        handleOk={() => acceptPlayer(pendingPlayer.id)}
        handleCancel={dismissNotification}
      />
      <Container maxWidth="md" className={content}>
        <Grid container direction="column" spacing={4}>
          {isAcceptedUser() && (
            <Grid item>
              <Share gameId={id} />
            </Grid>
          )}

          {!isAcceptedUser() && !isPendingUser() ? (
            <Grid item>
              <Button variant="outlined" disabled={operationLoading} onClick={joinGame}>
                {operationLoading && <CircularProgress size={24} className={loader} />}
                Ask to Join this Game
              </Button>
            </Grid>
          ) : null}

          <Grid item>
            <Players
              users={users}
              pendingPlayers={pendingPlayers}
              onAcceptPlayer={handleAcceptPlayer}
              onRejectPlayer={handleRejectPlayer}
              isAcceptedUser={isAcceptedUser()}
            />
          </Grid>

          <Typography align="center" variant="h2">
            {name}
          </Typography>
        </Grid>
      </Container>

      <Grid container alignContent="center" direction="column">
        {isAcceptedUser() && status === 'new' ? (
          <Button variant="outlined" size="large" disabled={operationLoading} onClick={startGame}>
            {operationLoading && <CircularProgress size={24} className={loader} />}
            Start Game
          </Button>
        ) : null}
      </Grid>
    </Container>
  );
};

export const GameComponent = memo(Component);
