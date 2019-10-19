import React, { memo } from 'react';
import { Container, Typography } from '@material-ui/core';
import { RouteComponentProps } from '@reach/router';

import useStyles from './Dashboard.styles';

const DashboardComponent: React.FC<RouteComponentProps> = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container maxWidth="md" component="main" className={classes.heroContent}>
        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          Welcome!
        </Typography>
      </Container>
    </div>
  );
};

export const Dashboard = memo(DashboardComponent);
