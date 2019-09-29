import React, { memo } from 'react';
import { CircularProgress } from '@material-ui/core';

import useStyles from './Loading.styles';

interface LoadingProps {
  show?: boolean;
}

const LoadingComponent: React.FC<LoadingProps> = ({ show = true }) => {
  const classes = useStyles();

  return show ? (
    <div className={`${classes.root} Loading`}>
      <CircularProgress size={60} thickness={4} color="primary" className={classes.progress} />
    </div>
  ) : null;
};

export const Loading = memo(LoadingComponent);
