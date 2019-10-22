import React, { memo } from 'react';
import { RouteComponentProps } from '@reach/router';

import { useAuth } from '../../hooks/Auth';
import { useStyles } from './Dashboard.styles';
import { DashboardComponent } from './DashboardComponent';

export const Dashboard: React.FC<RouteComponentProps> = memo(() => {
  const classes = useStyles();
  const { user } = useAuth();

  return <DashboardComponent user={user} classes={classes} />;
});
