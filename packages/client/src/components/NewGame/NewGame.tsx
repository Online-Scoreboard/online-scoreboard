import React, { memo, useCallback } from 'react';
import { RouteComponentProps, Redirect } from '@reach/router';
import { useMutation } from '@apollo/react-hooks';

import { CREATE_GAME } from './NewGame.graphql';
import { NewGameComponent } from './NewGameComponent';

interface CreateGameVariables {
  createGameInput: any;
}

const Component: React.FC<RouteComponentProps> = () => {
  const [createGame, { loading, error, data }] = useMutation<any, CreateGameVariables>(CREATE_GAME, {
    onError: err => {
      console.warn(err);
    },
  });

  const handleNewGame = useCallback(
    (gameInfo: any) => {
      createGame({
        variables: {
          createGameInput: gameInfo,
        },
      });
    },
    [createGame]
  );

  if (data && data.createGame) {
    const { id } = data.createGame;

    return <Redirect noThrow to={`/game/${id}`} />;
  }

  return <NewGameComponent onSubmit={handleNewGame} newGameLoading={loading} newGameError={error} />;
};

export const NewGame = memo(Component);
