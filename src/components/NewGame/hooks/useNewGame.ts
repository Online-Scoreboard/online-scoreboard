import { useReducer, useCallback } from 'react';
import Filter from 'bad-words';

import { newGameReducer, NewGameState } from '../NewGameReducer';
import {
  getDefaultTeams,
  getDefaultTeamColors,
  getColors,
  getMinGameNameLength,
  getMaxGameNameLength,
  getStartingStep,
  getSteps,
  getDefaultGameRules,
} from '../NewGameConstants';
import { TeamColor, GameListItem } from '../NewGameTypes';

const getInitialState = (): NewGameState => ({
  setup: {
    gameName: '',
  },
  teams: getDefaultTeams(),
  teamColors: getDefaultTeamColors(),
  rules: getDefaultGameRules(),
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
    (payload: { [name: string]: string | boolean | number }) => {
      const { scoringSystem, winningScore, winningScoreEnabled, startingScore } = rules;
      const payloadUpdated = { ...payload };
      const isWinningScoreEnabled =
        'winningScoreEnabled' in payload ? payload.winningScoreEnabled : winningScoreEnabled;

      if (
        isWinningScoreEnabled &&
        scoringSystem === 'increase' &&
        Number(payload.winningScore || winningScore) < Number(payload.startingScore || startingScore)
      ) {
        payloadUpdated.scoringSystem = 'decrease';
      } else if (
        isWinningScoreEnabled &&
        scoringSystem === 'decrease' &&
        Number(payload.winningScore || winningScore) > Number(payload.startingScore || startingScore)
      ) {
        payloadUpdated.scoringSystem = 'increase';
      }

      if (payload.isMatchesBased) {
        payloadUpdated.startingScore = '0';
      }

      payloadUpdated.teams = teams;

      if (payload.minTeamSize && teams < Number(payload.minTeamSize)) {
        payloadUpdated.teams = Number(payload.minTeamSize);
      }
      if (payload.maxTeamSize && teams > Number(payload.maxTeamSize)) {
        payloadUpdated.teams = Number(payload.maxTeamSize);
      }

      dispatch({
        type: 'RULES',
        payload: payloadUpdated,
      });
    },
    [rules, teams]
  );

  const handlePredefinedGameRuleChange = useCallback(
    (payload: GameListItem) => {
      const payloadUpdated = { ...payload, teams };

      if (payload.minTeamSize && teams < Number(payload.minTeamSize)) {
        payloadUpdated.teams = Number(payload.minTeamSize);
      }
      if (payload.maxTeamSize && teams > Number(payload.maxTeamSize)) {
        payloadUpdated.teams = Number(payload.maxTeamSize);
      }

      dispatch({
        type: 'PREDEFINED_RULES',
        payload: payloadUpdated,
      });
    },
    [teams]
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
          const {
            winningScoreEnabled,
            scoringSystem,
            winningScore,
            startingScore,
            isMatchesBased,
            minTeamSize,
            maxTeamSize,
          } = rules;

          if (winningScoreEnabled && scoringSystem === 'increase' && Number(winningScore) < Number(startingScore)) {
            return false;
          }
          if (winningScoreEnabled && scoringSystem === 'decrease' && Number(winningScore) > Number(startingScore)) {
            return false;
          }
          if (!isMatchesBased && winningScoreEnabled && Number(winningScore) === Number(startingScore)) {
            return false;
          }
          if (winningScoreEnabled && isMatchesBased && Number(winningScore) < 1) {
            return false;
          }
          if (isMatchesBased && (scoringSystem === 'decrease' || scoringSystem === 'both')) {
            return false;
          }
          if (minTeamSize > maxTeamSize) {
            return false;
          }
          if (maxTeamSize < minTeamSize) {
            return false;
          }

          return true;
        }
        case 2: {
          const { minTeamSize, maxTeamSize } = rules;
          if (Number(teams) < Number(minTeamSize)) {
            return false;
          }
          if (Number(teams) > Number(maxTeamSize)) {
            return false;
          }

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
    [rules, setup, teamColors, teams]
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
          const {
            winningScoreEnabled,
            scoringSystem,
            winningScore,
            startingScore,
            isMatchesBased,
            minTeamSize,
            maxTeamSize,
          } = rules;
          if (winningScoreEnabled && scoringSystem === 'increase' && Number(winningScore) < Number(startingScore)) {
            return 'You cannot set a winning score lower than the starting one when the score increases';
          }
          if (winningScoreEnabled && scoringSystem === 'decrease' && Number(winningScore) > Number(startingScore)) {
            return 'You cannot set a winning score higher than the starting one when the score decreases';
          }
          if (!isMatchesBased && winningScoreEnabled && Number(winningScore) === Number(startingScore)) {
            return 'You cannot set a winning score equal to the staring one';
          }
          if (winningScoreEnabled && isMatchesBased && Number(winningScore) < 1) {
            return 'Games matched based must have a minimum of 1 winning match';
          }
          if (isMatchesBased && (scoringSystem === 'decrease' || scoringSystem === 'both')) {
            return 'Games matched based must always increase team scores';
          }
          if (minTeamSize > maxTeamSize) {
            return 'Minimum team size cannot be bigger than the maximum one';
          }
          if (maxTeamSize < minTeamSize) {
            return 'Maximum team size cannot be bigger than the minimum one';
          }

          return 'Define your game rules';
        }
        case 2: {
          const { minTeamSize, maxTeamSize } = rules;
          if (Number(teams) < Number(minTeamSize)) {
            return `According to your Rules setup, this game will require at least ${minTeamSize} teams`;
          }
          if (Number(teams) > Number(maxTeamSize)) {
            return `According to your Rules setup, this game will require a maximum of ${maxTeamSize} teams`;
          }

          return `You can chose between ${minTeamSize} and ${maxTeamSize} teams according to the previous step`;
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
    [rules, setup, teamColors, teams]
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
    onPredefinedGameRuleChange: handlePredefinedGameRuleChange,
    onSetStep: onHandleSetStep,
  };
};
