import React, { memo } from 'react';
import { RouteComponentProps } from '@reach/router';

import { useAuth } from '../../hooks/Auth';
import { DashboardComponent } from './DashboardComponent';

export const Dashboard: React.FC<RouteComponentProps> = memo(() => {
  const { user, operationLoading } = useAuth();

  return <DashboardComponent user={user} loading={operationLoading} />;
});
