import { useReducer, useCallback } from 'react';
import Filter from 'bad-words';

import { newGameReducer, NewGameState } from './NewGameReducer';
import {
  getColors,
  getMinGameNameLength,
  getMaxGameNameLength,
  getSteps,
  getDefaultTeams,
  getDefaultTeamColors,
  getDefaultGameRules,
  getStartingStep,
} from './NewGameConstants';
import { TeamColor, GameListItem } from '../NewGameTypes';
import {
  colorsAction,
  predefinedRulesAction,
  teamsAction,
  customRulesAction,
  completeStepAction,
  setupAction,
} from './NewGameActions';

const initialState: NewGameState = {
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
};

export interface UseNewGame {
  steps: string[];
  colorsList: TeamColor[];
  gameSubmitted: boolean;
  rules: GameListItem;
  setup: {
    gameName: string;
  };
  teamColors: TeamColor[];
  teams: number;
  error: boolean;
  checkStep: (step: number) => boolean;
  activeStep: number;
  completedSteps: number[];
  getValidationNotes: (step: number) => string;
  onGameNameChange: (value: string) => void;
  onTeamColorsChange: (teamColor: TeamColor) => void;
  onTeamsChange: (newTeams: number) => void;
  onGameRulesChange: (payload: Partial<GameListItem>) => void;
  onPredefinedGameRuleChange: (payload: GameListItem) => void;
  onSetStep: (step: number) => void;
}

export const useNewGame = (): UseNewGame => {
  const badWordsFilter = new Filter();
  const stepsList = getSteps();
  const colorsList = getColors();
  const [state, dispatch] = useReducer(newGameReducer, initialState);
  const { gameSubmitted, rules, setup, teamColors, teams, steps, error } = state;
  const { active: activeStep, completed: completedSteps } = steps;

  const checkStep = useCallback(
    (step: number): boolean => {
      const minGameNameLength = getMinGameNameLength();
      const maxGameNameLength = getMaxGameNameLength();

      switch (step) {
        case 0: {
          const { gameName } = setup;
          const wordCheck = /[*<>~]+/.test(gameName);
          const badWords = badWordsFilter.isProfane(gameName);

          return (
            !badWords &&
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
          return checkStep(2) && teamColors && teamColors.length === teams;
        }
        case 4: {
          return true;
        }
        default: {
          return false;
        }
      }
    },
    [badWordsFilter, rules, setup, teamColors, teams]
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

          if (diff > 0) {
            return `Minimum name of ${minGameNameLength} characters. You must enter at lease ${diff} more characters`;
          } else if (overFlow >= 0) {
            return `Ops! That name is too long. A maximum of ${maxGameNameLength} characters is allowed`;
          }

          const wordCheck = /[*<>~]+/.test(gameName);
          if (wordCheck) {
            return 'Invalid game name. The following characters are not allowed: *, <, >, ~';
          }

          const badWords = badWordsFilter.isProfane(gameName);
          if (badWords) {
            return 'Ops! Bad words are not allowed in here. Please check your game name';
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

          return '';
        }
        case 2: {
          const { minTeamSize, maxTeamSize } = rules;

          if (minTeamSize === maxTeamSize && teams !== minTeamSize) {
            return `You must choose ${minTeamSize} teams according to your game rules`;
          }
          if (teams < minTeamSize) {
            return `According to your Rules setup, this game will require at least ${minTeamSize} teams`;
          }
          if (teams > maxTeamSize) {
            return `According to your Rules setup, this game will require a maximum of ${maxTeamSize} teams`;
          }

          return `You're all set to start a ${teams} teams game!`;
        }
        case 3: {
          const teamColorsLength = (teamColors && teamColors.length) || 0;
          const diff = teams - teamColorsLength;
          if (diff > 0) {
            return `You must choose ${diff} more color${diff > 1 ? 's' : ''}`;
          }
          if (!checkStep(3)) {
            return `You must choose ${teams} colors`;
          }

          return '';
        }
        case 4: {
          return 'Click next to start the game';
        }
        default: {
          return '';
        }
      }
    },
    [badWordsFilter, checkStep, rules, setup, teamColors, teams]
  );

  const handleGameNameChange = useCallback((value: string) => {
    dispatch(setupAction(value));
  }, []);

  const handleTeamColorsChange = useCallback(
    (teamColor: TeamColor) => {
      dispatch(colorsAction(teamColor, teamColors, teams));
    },
    [teamColors, teams]
  );

  const handleTeamsChange = useCallback(
    (newTeams: number) => {
      if (newTeams === teams) {
        return;
      }

      dispatch(teamsAction(newTeams));
    },
    [teams]
  );

  const handleGameRulesChange = useCallback(
    (payload: Partial<GameListItem>) => {
      dispatch(customRulesAction(payload, rules, teams));
    },
    [rules, teams]
  );

  const handlePredefinedGameRuleChange = useCallback(
    (payload: GameListItem) => {
      dispatch(predefinedRulesAction(payload, teams));
    },
    [teams]
  );

  const onHandleSetStep = useCallback(
    (step: number) => {
      const stepStatus = checkStep(activeStep);

      if (step === activeStep) {
        return;
      }

      dispatch(completeStepAction(stepsList, activeStep, stepStatus, completedSteps, step));
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
