import React, { memo } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useQuery, useSubscription, useMutation } from '@apollo/react-hooks';

import { GET_GAME, GAME_UPDATED, START_GAME } from './Game.graphql';
import { GameComponent } from './GameComponent';
import { Loading } from '../Loading';
import { Typography, Button } from '@material-ui/core';

interface GameProps extends RouteComponentProps {
  gameId?: string;
}

interface GameVariables {
  gameId: string;
}

const Component: React.FC<GameProps> = ({ gameId }) => {
  const { data, loading, error } = useQuery<any, GameVariables>(GET_GAME, {
    variables: { gameId: gameId || '' },
  });
  const [startGame, { data: startGameData, loading: startGameLoading }] = useMutation(START_GAME, {
    variables: { gameId },
  });
  const { data: gameUpdatedData } = useSubscription(GAME_UPDATED);

  console.warn('gameUpdatedData', gameUpdatedData);
  console.warn('startGameData', startGameData);
  console.warn('startGameLoading', startGameLoading);

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

  if (!data || !data.getGame) {
    return (
      <div>
        <Typography>Game not found</Typography>
      </div>
    );
  }

  return (
    <div>
      <GameComponent game={data.getGame} />
      <Button onClick={() => startGame({ variables: { gameId } })}>Start Game</Button>
    </div>
  );
};

export const Game = memo(Component);
