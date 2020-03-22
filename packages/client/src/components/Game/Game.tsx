import React, { memo, useCallback } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useQuery, useSubscription, useMutation } from '@apollo/react-hooks';
import { Typography } from '@material-ui/core';

import { GET_GAME, GAME_UPDATED, START_GAME, JOIN_GAME, ACCEPT_USER, REJECT_USER } from './Game.graphql';
import { Loading } from '../Loading';
import { useMessage } from '../../hooks/useMessage';
import { useAuth } from '../../hooks/Auth';
import { GameComponent } from './GameComponent';

interface GameProps extends RouteComponentProps {
  gameId?: string;
}

interface GameVariables {
  gameId: string;
}

interface GetUserVariables {
  userId: string;
}

const Component: React.FC<GameProps> = ({ gameId }) => {
  const { user } = useAuth();
  const { createMessage } = useMessage();
  const { data, loading, error } = useQuery<any, GameVariables>(GET_GAME, {
    variables: { gameId: gameId || '' },
  });
  const [_startGame, { loading: startGameLoading }] = useMutation(START_GAME, {
    onError: err => {
      createMessage(err.message, 'error');
    },
  });
  const [_joinGame, { loading: joinGameLoading }] = useMutation(JOIN_GAME, {
    onError: err => {
      createMessage(err.message, 'error');
    },
  });
  const [_acceptUser, { loading: acceptUserLoading }] = useMutation(ACCEPT_USER, {
    onError: err => {
      createMessage(err.message, 'error');
    },
  });
  const [_rejectUser, { loading: rejectUserLoading }] = useMutation(REJECT_USER, {
    onError: err => {
      createMessage(err.message, 'error');
    },
  });

  useSubscription(GAME_UPDATED, { variables: { id: gameId } });

  const startGame = useCallback(() => {
    return _startGame({ variables: { gameId } });
  }, [_startGame, gameId]);

  const joinGame = useCallback(() => {
    return _joinGame({ variables: { gameId } });
  }, [_joinGame, gameId]);

  const acceptUser = useCallback(
    (pendingUserId: string) => {
      return _acceptUser({ variables: { acceptUserInput: { gameId, pendingUserId } } });
    },
    [_acceptUser, gameId]
  );

  const rejectUser = useCallback(
    (pendingUserId: string) => {
      return _rejectUser({ variables: { rejectUserInput: { gameId, pendingUserId } } });
    },
    [_rejectUser, gameId]
  );

  const gameData = data && data.getGame;

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div>
        <Typography>Ops! Something went wrong</Typography>
        <Typography>Please, check your Internet connection and try again</Typography>
      </div>
    );
  }

  const operationLoading = acceptUserLoading || joinGameLoading || startGameLoading || rejectUserLoading;

  if (!gameData) {
    return (
      <div>
        <Typography>Game not found</Typography>
      </div>
    );
  }

  return (
    <GameComponent
      gameData={gameData}
      user={user}
      operationLoading={operationLoading}
      startGame={startGame}
      joinGame={joinGame}
      acceptUser={acceptUser}
      rejectUser={rejectUser}
    />
  );
};

export const Game = memo(Component);
