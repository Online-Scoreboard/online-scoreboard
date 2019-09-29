import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Container, Typography, Button, Grid } from '@material-ui/core';
import useStyles from './Home.styles';

export const Home: React.FC<RouteComponentProps> = () => {
  const { root, heroContent, heroImage, heroLogin } = useStyles();

  return (
    <div className={root}>
      <Container maxWidth="sm" component="main" className={heroContent}>
        <Container maxWidth="xs">
          <img src="/logo512.png" alt="logo" className={heroImage} />
        </Container>
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <Typography component="h1" variant="h2" align="center" gutterBottom>
              Online Scoreboard
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h5" align="center" color="secondary" paragraph>
              The online platform for game players
            </Typography>
          </Grid>

          <Grid item className={heroLogin}>
            <Button size="large" variant="contained" color="primary" href="/login">
              Log In
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
