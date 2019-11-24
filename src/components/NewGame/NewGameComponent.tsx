import React, { memo, useCallback } from 'react';
import { Container, Typography, Fab, Grid, Card, CardActions } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import { useNewGame } from './hooks';
import { useStyles } from './NewGame.styles';
import { Stepper } from './Stepper';
import { GameName } from './GameName';
import { GameTeams } from './GameTeams';
import { TeamColors } from './TeamColors';
import { GameRules } from './GameRules';
import { GameReview } from './GameReview';
import { GameCreation } from './GameCreation';

interface NewGameProps {
  newGameLoading: boolean;
  newGame: () => void;
}

const NewGameComponent: React.FC<NewGameProps> = ({ newGameLoading }) => {
  const { root, pageTitle, card, cardAction, cardValidationRed, cardValidationGreen } = useStyles();
  const {
    steps,
    rules,
    setup,
    teamColors,
    teams,
    colorsList,
    error,
    checkStep,
    activeStep,
    completedSteps,
    getValidationNotes,
    gameSubmitted,
    onSetStep,
    onTeamsChange,
    onGameNameChange,
    onTeamColorsChange,
    onGameRulesChange,
    onPredefinedGameRuleChange,
  } = useNewGame();

  const handleActiveStep = useCallback(
    (step: number) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (step < activeStep) {
        onSetStep(step);
        return;
      }

      if (!checkStep(activeStep)) {
        return;
      }
      if (step === activeStep + 1) {
        onSetStep(step);
        return;
      }
      if (~completedSteps.indexOf(step)) {
        onSetStep(step);
        return;
      }
    },
    [activeStep, checkStep, completedSteps, onSetStep]
  );

  const getStepContent = useCallback(
    (step: number) => {
      const { gameName } = setup;
      switch (step) {
        case 0:
          return <GameName gameName={gameName} onChange={onGameNameChange} />;
        case 1:
          return <GameRules rules={rules} onChange={onGameRulesChange} onGameRuleChange={onPredefinedGameRuleChange} />;
        case 2:
          return <GameTeams teams={teams} onChange={onTeamsChange} />;
        case 3:
          return <TeamColors teams={teams} colors={colorsList} teamColors={teamColors} onChange={onTeamColorsChange} />;
        case 4:
          return <GameReview gameName={gameName} rules={rules} teams={teams} teamColors={teamColors} />;
        case 5:
          return <GameCreation error={error} />;
        default:
          return 'Unknown step';
      }
    },
    [
      setup,
      onGameNameChange,
      rules,
      onGameRulesChange,
      onPredefinedGameRuleChange,
      teams,
      onTeamsChange,
      colorsList,
      teamColors,
      onTeamColorsChange,
      error,
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
            <Stepper activeStep={activeStep} steps={steps} onStepClick={handleActiveStep} completed={completedSteps} />
            {getStepContent(activeStep)}
            <CardActions className={isValid ? cardValidationGreen : cardValidationRed} disableSpacing>
              <Typography align="right" className={cardAction}>
                {getValidationNotes(activeStep)}
              </Typography>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Grid container justify="center">
        <Grid item xs={12} md={10}>
          <Grid container justify="space-between">
            {activeStep <= steps.length && (
              <Fab
                className="prevStep"
                variant="extended"
                color="primary"
                aria-label="prev"
                disabled={!activeStep || gameSubmitted}
                onClick={handleActiveStep(activeStep - 1)}
              >
                <NavigateBeforeIcon />
                Prev
              </Fab>
            )}

            {activeStep < steps.length && (
              <Fab
                className="nextStep"
                variant="extended"
                color="primary"
                aria-label="next"
                onClick={handleActiveStep(activeStep + 1)}
                disabled={!isValid || gameSubmitted}
              >
                Next
                <NavigateNextIcon />
              </Fab>
            )}

            {activeStep === steps.length && (
              <Fab
                className="ready"
                variant="extended"
                color="primary"
                aria-label="next"
                onClick={handleActiveStep(activeStep + 1)}
                disabled={gameSubmitted || completedSteps.length < steps.length}
              >
                Let's Go!
                <NavigateNextIcon />
              </Fab>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export const Component = memo(NewGameComponent);
