import React, { memo, useState, useCallback } from 'react';
import { Classes } from './NewGame.styles';
import { Container, Typography, Stepper, Step, StepLabel, Fab, Grid } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { GameName } from './GameName';
import { GamePlayers } from './GamePlayers';
import { PlayerColor } from './NewGameTypes';

interface NewGameComponentProps {
  classes: Classes;
  newGameLoading: boolean;
  newGame: () => void;
}

const getSteps = () => ['Setting up the game', 'Chose the players', 'Set the rules'];

const colors: PlayerColor[] = [
  'white',
  'red',
  'yellow',
  'blue',
  'green',
  'gray',
  'pink',
  'brown',
  'lime',
  'teal',
  'purple',
  'black',
];
const defaultPlayerColors: PlayerColor[] = ['red', 'yellow'];
const defaultPlayers = 2;

export const NewGameComponent: React.FC<NewGameComponentProps> = memo(({ classes, newGameLoading }) => {
  const { root, pageTitle, content } = classes;

  const [gameName, setGameName] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [players, setPlayers] = useState(defaultPlayers);
  const [playersColors, setPlayersColors] = useState(defaultPlayerColors);

  const steps = getSteps();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setGameName(event.target.value);
    },
    [setGameName]
  );

  const handlePlayersColorsChange = (playerColor: PlayerColor) => {
    if (playersColors.indexOf(playerColor) >= 0) {
      if (playersColors.length > 1) {
        setPlayersColors(playersColors.filter(color => color !== playerColor));
        return;
      }
      return;
    }

    if (playersColors.length >= players) {
      return;
    }

    setPlayersColors([...playersColors, playerColor]);
  };

  const handlePlayersChange = (newPlayers: number) => {
    if (newPlayers <= playersColors.length) {
      const playersDiff = playersColors.length - newPlayers;
      const newPlayersColors = playersColors.slice(0, playersDiff);

      setPlayersColors(newPlayersColors);
    }

    setPlayers(newPlayers);
    return;
  };

  const handleNextStep = useCallback(() => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  }, []);

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <GameName gameName={gameName} handleChange={handleChange} />;
      case 1:
        return (
          <GamePlayers
            colors={colors}
            players={players}
            playersColors={playersColors}
            onPlayersColorsChange={handlePlayersColorsChange}
            onPlayersChange={handlePlayersChange}
          />
        );
      case 2:
        return 'This is the bit I really care about!';
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container component="main" className={`${root} NewGame`}>
      <Typography component="h1" variant="h2" align="center" color="textPrimary" className={pageTitle}>
        Create A New Game
      </Typography>

      <Container maxWidth="sm" className={content}>
        <Stepper activeStep={activeStep}>
          {steps.map((label: string, index: number) => {
            const stepProps = {};
            const labelProps = {};

            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Container>

      <Container maxWidth="sm" className={content}>
        {getStepContent(activeStep)}
      </Container>

      <Grid container justify="center">
        <Fab variant="extended" color="primary" aria-label="add" onClick={handleNextStep}>
          Next
          <NavigateNextIcon />
        </Fab>
      </Grid>
    </Container>
  );
});
