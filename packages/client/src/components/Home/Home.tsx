import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Container, Typography, Button, Grid } from '@material-ui/core';
import { ReactComponent as Why } from './why.svg';
import { ReactComponent as What } from './what.svg';
import { ReactComponent as Features } from './test-tube.svg';
import useStyles from './Home.styles';

export const Home: React.FC<RouteComponentProps> = () => {
  const {
    root,
    heroContent,
    heroImage,
    heroLogin,
    section,
    article,
    icon,
    featuresList,
    featuresListItems,
  } = useStyles();

  return (
    <div className={`${root} Home`}>
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

      <section className={section}>
        <Container maxWidth="md" component="article" className={article}>
          <Grid container alignItems="center" justify="center" spacing={5}>
            <Grid item xs={4} sm={2}>
              <What className={icon} />
            </Grid>
            <Grid item xs={12} sm={10}>
              <Typography variant="h4" gutterBottom>
                What
              </Typography>
              <Typography color="textPrimary">
                Online Scoreboard is an online web application to let you create, update and share a virtual score board
                for playing your favourite game alone or with friends
              </Typography>
            </Grid>
          </Grid>
        </Container>

        <Container maxWidth="md" component="article" className={article}>
          <Grid container alignItems="center" justify="center" spacing={5}>
            <Grid item xs={4} sm={2}>
              <Why className={icon} />
            </Grid>
            <Grid item xs={12} sm={10}>
              <Typography variant="h4" gutterBottom>
                Why
              </Typography>
              <Typography color="textPrimary">
                When playing games with your friends, you might feel the need for tracking the players' scores
                somewhere, when an appropriate scoring system is not in place. Games like cards, darts, pool or
                ping-pong, just to mention some, don't always provide users with an integrated scoring system. Until
                now, players all around the world used to keep their scores in mind or write it down using pencil on
                paper. Online Scoreboard is aimed to fill this gap using technology
              </Typography>
            </Grid>
          </Grid>
        </Container>

        <Container maxWidth="md" component="article" className={article}>
          <Grid container alignItems="center" justify="center" spacing={5}>
            <Grid item xs={4} sm={2}>
              <Features className={icon} />
            </Grid>
            <Grid item xs={12} sm={10}>
              <Typography variant="h4" gutterBottom>
                Features
              </Typography>
              <ul className={featuresList}>
                <li className={featuresListItems}>
                  <Typography color="textPrimary">
                    Share the scoreboard with other players and let them interact with the game scoring
                  </Typography>
                </li>
                <li className={featuresListItems}>
                  <Typography color="textPrimary">
                    Start and end the game so that a scoreboard can potentially last for days or weeks, to allow all the
                    users to leave and return to the online board every time they need to update their scores
                  </Typography>
                </li>
                <li className={featuresListItems}>
                  <Typography color="textPrimary">
                    Generate Tournaments/Challenges with other players to organise events (Coming Soon)
                  </Typography>
                </li>
                <li className={featuresListItems}>
                  <Typography color="textPrimary">See all the player's scoreboard history in one place</Typography>
                </li>
                <li className={featuresListItems}>
                  <Typography color="textPrimary">Find and interact with friends</Typography>
                </li>
                <li className={featuresListItems}>
                  <Typography color="textPrimary">
                    Registered members only can interact with the games but the scoreboard can be made publicly visible
                  </Typography>
                </li>
                <li className={featuresListItems}>
                  <Typography color="textPrimary">
                    See the automatic generated charts and statistics based on your games statistics
                  </Typography>
                </li>
                <li className={featuresListItems}>
                  <Typography color="textPrimary">Keep track of all your played games in one place</Typography>
                </li>
              </ul>
            </Grid>
          </Grid>
        </Container>
      </section>
    </div>
  );
};
