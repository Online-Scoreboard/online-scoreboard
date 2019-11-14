import React, { memo } from 'react';
import { CircularProgress } from '@material-ui/core';

import useStyles from './Loading.styles';

interface LoadingProps {
  show?: boolean;
}

const LoadingComponent: React.FC<LoadingProps> = ({ show = true }) => {
  const { root, progress } = useStyles();

  return show ? (
    <div className={`${root} Loading`}>
      <CircularProgress size={60} thickness={4} color="primary" className={progress} />
    </div>
  ) : null;
};

export const Loading = memo(LoadingComponent);
