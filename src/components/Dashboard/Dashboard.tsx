import React, { memo } from 'react';
import { Container, Typography, Grid } from '@material-ui/core';
import { RouteComponentProps } from '@reach/router';

import useStyles from './Dashboard.styles';

const DashboardComponent: React.FC<RouteComponentProps> = () => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="md" className={`${classes.root} Dashboard`}>
      <Grid container direction="column" alignItems="center">
        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          Welcome!
        </Typography>
      </Grid>
    </Container>
  );
};

export const Dashboard = memo(DashboardComponent);
