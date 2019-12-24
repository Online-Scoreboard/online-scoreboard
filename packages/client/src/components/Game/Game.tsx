import React, { memo } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useQuery } from '@apollo/react-hooks';

import { GET_GAME } from './Game.graphql';
import { GameComponent } from './GameComponent';
import { Loading } from '../Loading';
import { Typography } from '@material-ui/core';

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

  return <GameComponent />;
};

export const Game = memo(Component);
