import React, { memo, useState, useCallback, useReducer } from 'react';
import { Container, Typography, Fab, Grid, Card, CardActions } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import {
  getSteps,
  getStartingStep,
  getColors,
  getDefaultPlayerColors,
  getDefaultPlayers,
  getMinGameNameLength,
  getMaxGameNameLength,
} from './NewGameConstants';
import { NewGameState, newGameReducer } from './NewGameReducer';
import { PlayerColor } from './NewGameTypes';
import { useStyles } from './NewGame.styles';
import { Stepper } from './Stepper';
import { GameName } from './GameName';
import { GamePlayers } from './GamePlayers';
import { PlayerColors } from './PlayerColors';

const getInitialState = (): NewGameState => ({
  setup: {
    gameName: '',
  },
  players: getDefaultPlayers(),
  playerColors: getDefaultPlayerColors(),
});

interface NewGameProps {
  newGameLoading: boolean;
  newGame: () => void;
}

const NewGameComponent: React.FC<NewGameProps> = ({ newGameLoading }) => {
  const initialState = getInitialState();
  const steps = getSteps();
  const startingStep = getStartingStep();
  const { root, pageTitle, content, card, cardAction, cardValidationRed, cardValidationGreen } = useStyles();
  const [state, dispatch] = useReducer(newGameReducer, initialState);
  const [activeStep, setActiveStep] = useState(startingStep);

  const handleGameNameChange = useCallback((value: string) => {
    dispatch({ type: 'SETUP', payload: value });
  }, []);

  const handlePlayerColorsChange = useCallback(
    (playerColor: PlayerColor) => {
      const { playerColors, players } = state;

      if (playerColors.indexOf(playerColor) >= 0) {
        const newPlayerColors = playerColors.filter(color => color !== playerColor);
        dispatch({ type: 'COLORS', payload: newPlayerColors });
        return;
      }

      if (playerColors.length >= players) {
        return;
      }

      const newPlayerColors = [...playerColors, playerColor];
      dispatch({ type: 'COLORS', payload: newPlayerColors });
    },
    [state]
  );

  const checkStep = useCallback(
    (step: number): boolean => {
      const { setup, players, playerColors } = state;
      const minGameNameLength = getMinGameNameLength();
      const maxGameNameLength = getMaxGameNameLength();

      switch (step) {
        case 0: {
          return Boolean(
            setup.gameName && setup.gameName.length >= minGameNameLength && setup.gameName.length < maxGameNameLength
          );
        }
        case 1: {
          return true;
        }
        case 2: {
          return playerColors.length === players;
        }
        default: {
          return false;
        }
      }
    },
    [state]
  );

  const getValidationNotes = useCallback(
    (step: number): string => {
      const { setup, players, playerColors } = state;
      const minGameNameLength = getMinGameNameLength();
      const maxGameNameLength = getMaxGameNameLength();

      switch (step) {
        case 0: {
          const diff = minGameNameLength - setup.gameName.length;
          const overFlow = setup.gameName.length - maxGameNameLength;

          if (diff > 0) {
            return `Minimum name of ${minGameNameLength} characters. You must enter at lease ${diff} more characters`;
          } else if (overFlow >= 0) {
            return `Ops! That name is too long. A maximum of ${maxGameNameLength} characters is allowed`;
          }
          return 'Your game name looks amazing!';
        }
        case 1: {
          return 'You can chose between 1 and 12 players/teams';
        }
        case 2: {
          const diff = players - playerColors.length;

          if (diff > 0) {
            return `You must chose ${diff} more color${diff > 1 ? 's' : ''}`;
          }
          return 'All your players have a color!';
        }
        default: {
          return '';
        }
      }
    },
    [state]
  );

  const handleNextStep = useCallback(() => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  }, []);

  const handlePrevStep = useCallback(() => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }, []);

  const handlePlayersChange = useCallback(
    (newPlayers: number) => {
      const { playerColors, players } = state;
      const colors = getColors();
      let newPlayerColors = playerColors;

      if (newPlayers === players) {
        return;
      }

      if (newPlayers === playerColors.length) {
        dispatch({
          type: 'PLAYERS',
          payload: {
            players: newPlayers,
          },
        });

        return;
      }

      if (newPlayers <= playerColors.length) {
        newPlayerColors = playerColors.slice(0, newPlayers);
      }

      if (newPlayers > playerColors.length) {
        const availableColors = colors.filter(playerColor => playerColors.indexOf(playerColor) === -1).reverse();

        newPlayerColors = new Array(newPlayers - playerColors.length)
          .fill(true)
          .reduce(totPlayers => [...totPlayers, availableColors.pop()], playerColors);
      }

      dispatch({
        type: 'PLAYERS',
        payload: {
          players: newPlayers,
          playerColors: newPlayerColors,
        },
      });
    },
    [state]
  );

  const getStepContent = useCallback(
    (step: number) => {
      const { setup, players, playerColors } = state;
      const colors = getColors();

      switch (step) {
        case 0:
          return <GameName gameName={setup.gameName} onChange={handleGameNameChange} />;
        case 1:
          return <GamePlayers players={players} onChange={handlePlayersChange} />;
        case 2:
          return (
            <PlayerColors
              players={players}
              colors={colors}
              playerColors={playerColors}
              onChange={handlePlayerColorsChange}
            />
          );
        default:
          return 'Unknown step';
      }
    },
    [state, handleGameNameChange, handlePlayersChange, handlePlayerColorsChange]
  );

  const isValid = checkStep(activeStep);

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
            <CardActions className={isValid ? cardValidationGreen : cardValidationRed} disableSpacing>
              <Typography align="right" className={cardAction}>
                {getValidationNotes(activeStep)}
              </Typography>
            </CardActions>
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
            <Fab
              className="nextStep"
              variant="extended"
              color="primary"
              aria-label="next"
              onClick={handleNextStep}
              disabled={!isValid}
            >
              Next
              <NavigateNextIcon />
            </Fab>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export const Component = memo(NewGameComponent);
