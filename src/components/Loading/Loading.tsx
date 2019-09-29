import React, { memo } from 'react';
import { CircularProgress } from '@material-ui/core';

import useStyles from './Loading.styles';

interface LoadingComponentProps {
  show: boolean;
}

type LoadingProps = React.FC<LoadingComponentProps> & { defaultProps: Partial<LoadingProps> };

const LoadingComponent: LoadingProps = ({ show }) => {
  const classes = useStyles();

  return show ? (
    <div className={`${classes.root} Loading`}>
      <CircularProgress size={60} thickness={4} color="primary" className={classes.progress} />
    </div>
  ) : null;
};

LoadingComponent.defaultProps = {
  show: true,
};

export const Loading = memo(LoadingComponent);
