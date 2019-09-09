import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { useStyles } from './Loading.styles';

export const Loading = React.memo(() => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress size={60} thickness={4} color="primary" className={classes.progress} />
    </div>
  );
});
