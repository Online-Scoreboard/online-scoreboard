import React, { memo, useCallback } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useMutation } from '@apollo/react-hooks';

import { NEW_GAME } from './NewGame.graphql';
import { Component as NewGameComponent } from './NewGameComponent';

interface CreateGameVariables {
  createGameInput: {
    id: string;
  };
}

const NewGame: React.FC<RouteComponentProps> = () => {
  const [newGame, { loading: newGameLoading }] = useMutation<void, CreateGameVariables>(NEW_GAME);

  const handleNewGame = useCallback(() => {
    newGame({
      variables: {
        createGameInput: { id: 's' },
      },
    });
  }, [newGame]);

  return <NewGameComponent newGame={handleNewGame} newGameLoading={newGameLoading} />;
};

export const NewGameWrapper = memo(NewGame);
