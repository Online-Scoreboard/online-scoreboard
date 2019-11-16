import { useReducer, useCallback } from 'react';
import Filter from 'bad-words';

import { newGameReducer, NewGameState } from '../NewGameReducer';
import {
  getDefaultTeams,
  getDefaultTeamColors,
  getColors,
  getMinGameNameLength,
  getMaxGameNameLength,
  getDefaultStartingScore,
  getDefaultWinningScore,
  getDefaultWinningScoreEnabled,
  getDefaultScoringSystem,
  getStartingStep,
  getSteps,
} from '../NewGameConstants';
import { TeamColor } from '../NewGameTypes';

const getInitialState = (): NewGameState => ({
  setup: {
    gameName: '',
  },
  teams: getDefaultTeams(),
  teamColors: getDefaultTeamColors(),
  rules: {
    startingScore: getDefaultStartingScore(),
    winningScore: getDefaultWinningScore(),
    winningScoreEnabled: getDefaultWinningScoreEnabled(),
    scoringSystem: getDefaultScoringSystem(),
  },
  steps: {
    completed: [],
    active: getStartingStep(),
  },
  gameSubmitted: false,
  error: false,
});

export const useNewGame = () => {
  const initialState = getInitialState();
  const stepsList = getSteps();
  const colorsList = getColors();
  const filter = new Filter();
  const [state, dispatch] = useReducer(newGameReducer, initialState);
  const { gameSubmitted, rules, setup, teamColors, teams, steps, error } = state;
  const { active: activeStep, completed: completedSteps } = steps;

  const handleGameNameChange = useCallback(
    (value: string) => {
      const filteredValue = filter.clean(value);

      dispatch({ type: 'SETUP', payload: filteredValue });
    },
    [filter]
  );

  const handleTeamColorsChange = useCallback(
    (teamColor: TeamColor) => {
      if (teamColors.indexOf(teamColor) >= 0) {
        const newTeamColors = teamColors.filter(color => color !== teamColor);
        dispatch({ type: 'COLORS', payload: newTeamColors });
        return;
      }

      if (teamColors.length >= teams) {
        return;
      }

      const newTeamColors = [...teamColors, teamColor];
      dispatch({ type: 'COLORS', payload: newTeamColors });
    },
    [teamColors, teams]
  );

  const handleTeamsChange = useCallback(
    (newTeams: number) => {
      let newTeamColors = [...teamColors];

      if (newTeams === teams) {
        return;
      }

      if (newTeams === teamColors.length) {
        dispatch({
          type: 'TEAMS',
          payload: {
            teams: newTeams,
          },
        });

        return;
      }

      if (newTeams <= teamColors.length) {
        newTeamColors = teamColors.slice(0, newTeams);
      }

      if (newTeams > teamColors.length) {
        const availableColors = colorsList.filter(teamColor => teamColors.indexOf(teamColor) === -1).reverse();

        newTeamColors = new Array(newTeams - teamColors.length)
          .fill(true)
          .reduce(totTeams => [...totTeams, availableColors.pop()], teamColors);
      }

      dispatch({
        type: 'TEAMS',
        payload: {
          teams: newTeams,
          teamColors: newTeamColors,
        },
      });
    },
    [colorsList, teamColors, teams]
  );

  const handleGameRulesChange = useCallback(
    (payload: { [name: string]: string | boolean }) => {
      const payloadUpdated = { ...payload };
      const isWinningScoreEnabled =
        'winningScoreEnabled' in payload ? payload.winningScoreEnabled : rules.winningScoreEnabled;

      if (
        isWinningScoreEnabled &&
        rules.scoringSystem === 'increase' &&
        Number(payload.winningScore || rules.winningScore) < Number(payload.startingScore || rules.startingScore)
      ) {
        payloadUpdated.scoringSystem = 'decrease';
      } else if (
        isWinningScoreEnabled &&
        rules.scoringSystem === 'decrease' &&
        Number(payload.winningScore || rules.winningScore) > Number(payload.startingScore || rules.startingScore)
      ) {
        payloadUpdated.scoringSystem = 'increase';
      }

      dispatch({
        type: 'RULES',
        payload: payloadUpdated,
      });
    },
    [rules]
  );

  const checkStep = useCallback(
    (step: number): boolean => {
      const minGameNameLength = getMinGameNameLength();
      const maxGameNameLength = getMaxGameNameLength();

      switch (step) {
        case 0: {
          const { gameName } = setup;
          const wordCheck = /[*<>~]+/.test(gameName);

          return (
            !wordCheck &&
            Boolean(gameName && gameName.length >= minGameNameLength && gameName.length < maxGameNameLength)
          );
        }
        case 1: {
          if (!rules.winningScoreEnabled) {
            return true;
          }

          if (rules.scoringSystem === 'increase' && Number(rules.winningScore) < Number(rules.startingScore)) {
            return false;
          }
          if (rules.scoringSystem === 'decrease' && Number(rules.winningScore) > Number(rules.startingScore)) {
            return false;
          }
          if (Number(rules.winningScore) === Number(rules.startingScore)) {
            return false;
          }

          return true;
        }
        case 2: {
          return true;
        }
        case 3: {
          return teamColors && teamColors.length === teams;
        }
        default: {
          return false;
        }
      }
    },
    [rules.scoringSystem, rules.startingScore, rules.winningScore, rules.winningScoreEnabled, setup, teamColors, teams]
  );

  const getValidationNotes = useCallback(
    (step: number): string => {
      const minGameNameLength = getMinGameNameLength();
      const maxGameNameLength = getMaxGameNameLength();

      switch (step) {
        case 0: {
          const { gameName } = setup;
          const diff = minGameNameLength - gameName.length;
          const overFlow = gameName.length - maxGameNameLength;
          const wordCheck = /[*<>~]+/.test(gameName);

          if (diff > 0) {
            return `Minimum name of ${minGameNameLength} characters. You must enter at lease ${diff} more characters`;
          } else if (overFlow >= 0) {
            return `Ops! That name is too long. A maximum of ${maxGameNameLength} characters is allowed`;
          }

          if (wordCheck) {
            return 'Invalid game name. Bad words and the following characters are not allowed: *, <, >, ~';
          }

          return 'Your game name looks amazing!';
        }
        case 1: {
          if (!rules.winningScoreEnabled) {
            return 'Define your game rules';
          }

          if (rules.scoringSystem === 'increase' && Number(rules.winningScore) < Number(rules.startingScore)) {
            return 'You cannot set a winning score lower than the starting one when the score increases';
          }
          if (rules.scoringSystem === 'decrease' && Number(rules.winningScore) > Number(rules.startingScore)) {
            return 'You cannot set a winning score higher than the starting one when the score decreases';
          }
          if (Number(rules.winningScore) === Number(rules.startingScore)) {
            return 'You cannot set a winning score equal to the staring one';
          }

          return 'Define your game rules';
        }
        case 2: {
          return 'You can chose between 1 and 12 teams';
        }
        case 3: {
          const teamColorsLength = (teamColors && teamColors.length) || 0;
          const diff = teams - teamColorsLength;

          if (diff > 0) {
            return `You must chose ${diff} more color${diff > 1 ? 's' : ''}`;
          }
          return 'All your teams have a color!';
        }
        case 4: {
          return 'Are you ready?';
        }
        default: {
          return '';
        }
      }
    },
    [rules.scoringSystem, rules.startingScore, rules.winningScore, rules.winningScoreEnabled, setup, teamColors, teams]
  );

  const onHandleSetStep = useCallback(
    (step?: number) => {
      const stepStatus = checkStep(activeStep);
      const completedStepsUpdated = stepsList
        .map((_stepName, index) => index)
        .filter((_stepName, index) => (index === activeStep && stepStatus) || completedSteps.indexOf(index) !== -1);

      if (typeof step === 'number' && step === activeStep) {
        return;
      }

      if (typeof step === 'number') {
        dispatch({
          type: 'COMPLETE_STEP',
          payload: {
            completedSteps: completedStepsUpdated,
            activeStep: step,
          },
        });
        return;
      }

      if (stepsList.length === activeStep && completedStepsUpdated.length === stepsList.length) {
        dispatch({ type: 'SUBMIT' });
        return;
      }

      const nextAvailableStep = stepsList
        .map((val, index) => index)
        .filter(val => completedStepsUpdated.indexOf(val) === -1)[0];
      const nextStep = typeof nextAvailableStep === 'number' ? nextAvailableStep : stepsList.length;

      dispatch({
        type: 'COMPLETE_STEP',
        payload: {
          completedSteps: completedStepsUpdated,
          activeStep: nextStep,
        },
      });
    },
    [activeStep, checkStep, completedSteps, stepsList]
  );

  return {
    steps: stepsList,
    colorsList,
    gameSubmitted,
    rules,
    setup,
    teamColors,
    teams,
    error,
    checkStep,
    activeStep,
    completedSteps,
    getValidationNotes,
    onGameNameChange: handleGameNameChange,
    onTeamColorsChange: handleTeamColorsChange,
    onTeamsChange: handleTeamsChange,
    onGameRulesChange: handleGameRulesChange,
    onSetStep: onHandleSetStep,
  };
};
