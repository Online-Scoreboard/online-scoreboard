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

        <Typography variant="h5" align="center" color="textSecondary" component="p">
          Quickly build an effective pricing table for your potential customers with this layout. It&apos;s built with
          default Material-UI components with little customization.
        </Typography>
      </Container>
    </div>
  );
};

export const Dashboard = memo(DashboardComponent);
