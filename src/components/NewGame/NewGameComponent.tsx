import React, { memo, useState, useCallback } from 'react';
import { Container, Typography, Fab, Grid, Card } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import { Stepper } from './Stepper';
import { GameName } from './GameName';
import { GamePlayers } from './GamePlayers';
import { PlayerColor } from './NewGameTypes';
import { useStyles } from './NewGame.styles';
import { PlayersColors } from './PlayersColors';

interface NewGameProps {
  newGameLoading: boolean;
  newGame: () => void;
}

const getSteps = () => ['Setup', 'Players', 'Colors', 'Rules'];

const colors: PlayerColor[] = [
  'black',
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
];
const defaultPlayerColors: PlayerColor[] = ['black', 'white'];
const defaultPlayers = 2;

export const NewGameComponent: React.FC<NewGameProps> = memo(({ newGameLoading }) => {
  const { root, pageTitle, content, card } = useStyles();

  const [gameName, setGameName] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [players, setPlayers] = useState(defaultPlayers);
  const [playersColors, setPlayersColors] = useState(defaultPlayerColors);

  const steps = getSteps();

  const handleChange = useCallback(
    (value: string) => {
      setGameName(value);
    },
    [setGameName]
  );

  const handlePlayersColorsChange = (playerColor: PlayerColor) => {
    if (playersColors.indexOf(playerColor) >= 0) {
      if (playersColors.length) {
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
      const availableColors = colors.filter(playerColor => playersColors.indexOf(playerColor) === -1).reverse();

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
        return <GameName gameName={gameName} onChange={handleChange} />;
      case 1:
        return <GamePlayers players={players} onPlayersChange={handlePlayersChange} />;
      case 2:
        return (
          <PlayersColors
            players={players}
            colors={colors}
            playersColors={playersColors}
            onPlayersColorsChange={handlePlayersColorsChange}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" component="main" className={`${root} NewGame`}>
      <Typography component="h1" variant="h2" align="center" color="textPrimary" className={pageTitle}>
        Create A New Game
      </Typography>

      <Grid container justify="center">
        <Grid item xs={12} md={10}>
          <Card className={card} elevation={10}>
            <Stepper activeStep={activeStep} steps={steps} />
            {getStepContent(activeStep)}
          </Card>
        </Grid>
      </Grid>

      <Grid container className={content} justify="center">
        <Grid item xs={12} md={10}>
          <Grid container justify="space-between">
            <Fab
              className="prevStep"
              variant="extended"
              color="primary"
              aria-label="prev"
              disabled={!activeStep}
              onClick={handlePrevStep}
            >
              <NavigateBeforeIcon />
              Prev
            </Fab>
            <Fab className="nextStep" variant="extended" color="primary" aria-label="next" onClick={handleNextStep}>
              Next
              <NavigateNextIcon />
            </Fab>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
});
