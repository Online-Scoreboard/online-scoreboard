import React, { memo } from 'react';
import { navigate } from '@reach/router';

import { Container, Typography, Grid, Button } from '@material-ui/core';
import { User } from '../../hooks/Auth';
import { Classes } from './Dashboard.styles';
import { Loading } from '../Loading';

interface DashboardComponentProps {
  user: User;
  classes: Classes;
  loading: boolean;
}

export const DashboardComponent: React.FC<DashboardComponentProps> = memo(({ classes, user, loading }) => {
  const { root, grid } = classes;

  if (loading) {
    return <Loading />;
  }

  return (
    <Container component="main" maxWidth="md" className={`${root} Dashboard`}>
      <Grid container direction="column" alignItems="center">
        <Typography className="welcome" component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          Welcome {user.username}!
        </Typography>
      </Grid>

      <Grid container direction="column" alignItems="center" className={grid}>
        <Button
          className="NewGame"
          variant="contained"
          size="large"
          color="primary"
          onClick={() => navigate('/new-game')}
        >
          Create A New Game
        </Button>
      </Grid>
    </Container>
  );
});
