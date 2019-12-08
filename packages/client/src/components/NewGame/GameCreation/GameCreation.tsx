import React from 'react';
import { Typography, CircularProgress } from '@material-ui/core';

import { useStyles } from '../NewGame.styles';

interface GameCreationProps {
  error: boolean;
}

export const GameCreation: React.FC<GameCreationProps> = ({ error }) => {
  const { loader, content } = useStyles();

  if (error) {
    return (
      <div className={loader}>
        <Typography>{error}</Typography>
      </div>
    );
  }

  return (
    <div className={loader}>
      <CircularProgress size={60} thickness={4} color="primary" className={content} />
      <Typography>Please, wait for your scoreboard to be created...</Typography>
    </div>
  );
};
