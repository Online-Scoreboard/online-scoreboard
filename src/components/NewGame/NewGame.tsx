import React, { memo, useCallback } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useMutation } from '@apollo/react-hooks';

import { NEW_GAME } from './NewGame.graphql';
import { useStyles } from './NewGame.styles';
import { NewGameComponent } from './NewGameComponent';

type NewGameVariables = {
  newGameInput: {
    id: string;
  };
};

export const NewGame: React.FC<RouteComponentProps> = memo(() => {
  const classes = useStyles();
  const [newGame, { loading: newGameLoading }] = useMutation<void, NewGameVariables>(NEW_GAME);

  const handleNewGame = useCallback(() => {
    newGame({
      variables: {
        newGameInput: { id: 's' },
      },
    });
  }, [newGame]);

  return <NewGameComponent classes={classes} newGame={handleNewGame} newGameLoading={newGameLoading} />;
});
