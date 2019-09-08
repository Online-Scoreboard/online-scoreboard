import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography } from '@material-ui/core';
import { RouteComponentProps } from '@reach/router';

const useStyles = makeStyles(theme => ({
  root: {},
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
}));

export const Home: React.FC<RouteComponentProps> = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container maxWidth="md" component="main" className={classes.heroContent}>
        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          Welcome!
        </Typography>

        <Typography variant="h5" align="center" color="textSecondary" component="p">
          Quickly build an effective pricing table for your potential customers with this layout. It&apos;s built with
          default Material-UI components with little customization.
        </Typography>
      </Container>
    </div>
  );
};
