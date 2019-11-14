import React, { memo, useState, useCallback } from 'react';
import { Container, Typography, Fab, Grid, Card, CardActions, CircularProgress } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import { getSteps, getStartingStep, getColors } from './NewGameConstants';
import { useNewGame } from './hooks';
import { useStyles } from './NewGame.styles';
import { Stepper } from './Stepper';
import { GameName } from './GameName';
import { GamePlayers } from './GamePlayers';
import { PlayerColors } from './PlayerColors';
import { GameRules } from './GameRules';

interface NewGameProps {
  newGameLoading: boolean;
  newGame: () => void;
}

const NewGameComponent: React.FC<NewGameProps> = ({ newGameLoading }) => {
  const steps = getSteps();
  const startingStep = getStartingStep();
  const { root, pageTitle, content, card, cardAction, cardValidationRed, cardValidationGreen, loader } = useStyles();
  const [activeStep, setActiveStep] = useState(startingStep);
  const {
    state,
    error,
    onGameNameChange,
    onPlayerColorsChange,
    onPlayersChange,
    onGameRulesChange,
    getValidationNotes,
    checkStep,
    gameCreationProgress,
    showGameCreationProgress,
  } = useNewGame();

  const handleNextStep = useCallback(() => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);

    if (activeStep === steps.length - 1) {
      showGameCreationProgress();
    }
  }, [activeStep, showGameCreationProgress, steps.length]);

  const handlePrevStep = useCallback(() => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }, []);

  const getStepContent = useCallback(
    (step: number) => {
      const { setup, players, playerColors, rules } = state;
      const colors = getColors();

      switch (step) {
        case 0:
          return <GameName gameName={setup.gameName} onChange={onGameNameChange} />;
        case 1:
          return <GamePlayers players={players} onChange={onPlayersChange} />;
        case 2:
          return (
            <PlayerColors
              players={players}
              colors={colors}
              playerColors={playerColors}
              onChange={onPlayerColorsChange}
            />
          );
        case 3:
          return (
            <GameRules
              startingScore={rules.startingScore}
              winningScore={rules.winningScore}
              winningScoreEnabled={rules.winningScoreEnabled}
              scoringSystem={rules.scoringSystem}
              onChange={onGameRulesChange}
            />
          );
        case 4:
          return (
            (!error && (
              <div className={loader}>
                <CircularProgress size={60} thickness={4} color="primary" className={content} />
                <Typography>{gameCreationProgress}</Typography>
              </div>
            )) || (
              <div className={loader}>
                <Typography>{error}</Typography>
              </div>
            )
          );
        default:
          return 'Unknown step';
      }
    },
    [
      state,
      onGameNameChange,
      onPlayersChange,
      onPlayerColorsChange,
      onGameRulesChange,
      error,
      loader,
      content,
      gameCreationProgress,
    ]
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
              {activeStep === steps.length - 1 ? "Let's Go!" : 'Next'}
              <NavigateNextIcon />
            </Fab>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export const Component = memo(NewGameComponent);
