import React, { memo, useState, useCallback } from 'react';
import { Container, Typography, Stepper, Step, StepLabel, Fab, Grid } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import { GameName } from './GameName';
import { GamePlayers } from './GamePlayers';
import { PlayerColor } from './NewGameTypes';
import { useStyles } from './NewGame.styles';

interface NewGameComponentProps {
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
const defaultPlayerColors: PlayerColor[] = ['black', 'white'];
const defaultPlayers = 2;

export const NewGameComponent: React.FC<NewGameComponentProps> = memo(({ newGameLoading }) => {
  const { root, pageTitle, content } = useStyles();

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
    if (newPlayers === players) {
      return;
    }

    if (newPlayers === playersColors.length) {
      setPlayers(newPlayers);
      return;
    }

    if (newPlayers <= playersColors.length) {
      const newPlayersColors = playersColors.slice(0, newPlayers);

      setPlayersColors(newPlayersColors);
    }

    if (newPlayers > playersColors.length) {
      const availableColors = colors.filter(playerColor => playersColors.indexOf(playerColor) === -1);
      const newPlayersColors = new Array(newPlayers - playersColors.length)
        .fill(true)
        .reduce(totPlayers => [...totPlayers, availableColors.pop()], playersColors);

      setPlayersColors(newPlayersColors);
    }

    setPlayers(newPlayers);
  };

  const handleNextStep = useCallback(() => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  }, []);

  const handlePrevStep = useCallback(() => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
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
    <Container maxWidth="md" component="main" className={`${root} NewGame`}>
      <Typography component="h1" variant="h2" align="center" color="textPrimary" className={pageTitle}>
        Create A New Game
      </Typography>

      <Grid container className={content} justify="center">
        <Grid item xs={12} md={10}>
          <Stepper square={false} activeStep={activeStep}>
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
        </Grid>
      </Grid>

      <Grid container className={content} justify="center">
        {getStepContent(activeStep)}
      </Grid>

      <Grid container className={content} justify="center">
        <Grid item xs={12} md={10}>
          <Grid container className={content} justify="space-between">
            <Fab variant="extended" color="primary" aria-label="prev" disabled={!activeStep} onClick={handlePrevStep}>
              <NavigateBeforeIcon />
              Prev
            </Fab>
            <Fab variant="extended" color="primary" aria-label="next" onClick={handleNextStep}>
              Next
              <NavigateNextIcon />
            </Fab>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
});
