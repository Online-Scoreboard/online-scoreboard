import {
  NewGameActionType,
  PREDEFINED_RULES,
  COLORS,
  TEAMS,
  RULES,
  RulesPayload,
  SUBMIT,
  COMPLETE_STEP,
  SETUP,
} from './NewGameActionTypes';
import { GameListItem, TeamColor } from '../NewGameTypes';

export const setupAction = (value: string): NewGameActionType => {
  return {
    type: SETUP,
    payload: value,
  };
};

export const colorsAction = (teamColor: TeamColor, teamColors: TeamColor[], teams: number): NewGameActionType => {
  if (teamColors.indexOf(teamColor) >= 0) {
    const newTeamColors = teamColors.filter(color => color !== teamColor);
    return { type: COLORS, payload: newTeamColors };
  }

  if (teamColors.length >= teams) {
    return { type: COLORS, payload: teamColors };
  }

  const newTeamColors = [...teamColors, teamColor];
  return { type: COLORS, payload: newTeamColors };
};

export const teamsAction = (colorsList: TeamColor[], teamColors: TeamColor[], newTeams: number): NewGameActionType => {
  let newTeamColors = [...teamColors];

  if (newTeams < teamColors.length) {
    newTeamColors = teamColors.slice(0, newTeams);
  }

  if (newTeams > teamColors.length) {
    const availableColors = colorsList.filter(teamColor => teamColors.indexOf(teamColor) === -1).reverse();

    if (availableColors.length) {
      newTeamColors = new Array(newTeams - teamColors.length)
        .fill(true)
        .reduce(totTeams => [...totTeams, availableColors.pop()], teamColors);
    }
  }

  return {
    type: TEAMS,
    payload: {
      teams: newTeams,
      teamColors: newTeamColors,
    },
  };
};

export const predefinedRulesAction = (rules: GameListItem, teams: number): NewGameActionType => {
  const rulesUpdated = { ...rules, teams };

  if (rules.minTeamSize && teams < Number(rules.minTeamSize)) {
    rulesUpdated.teams = Number(rules.minTeamSize);
  }
  if (rules.maxTeamSize && teams > Number(rules.maxTeamSize)) {
    rulesUpdated.teams = Number(rules.maxTeamSize);
  }

  return {
    type: PREDEFINED_RULES,
    payload: rulesUpdated,
  };
};

export const customRulesAction = (
  newRules: Partial<GameListItem>,
  rules: GameListItem,
  teams: number
): NewGameActionType => {
  const {
    scoringSystem,
    winningScore,
    winningScoreEnabled,
    isMatchesBased,
    startingScore,
    minTeamSize,
    maxTeamSize,
  } = rules;
  const payloadUpdated: RulesPayload = {
    ...rules,
    ...newRules,
    teams,
  };
  const winningScoreEnabledValue =
    'winningScoreEnabled' in newRules ? newRules.winningScoreEnabled : winningScoreEnabled;
  const matchBasedEnabled = 'isMatchesBased' in newRules ? newRules.isMatchesBased : isMatchesBased;
  const winningScoreValue = 'winningScore' in newRules ? Number(newRules.winningScore) : winningScore || 0;
  const startingScoreValue = 'startingScore' in newRules ? Number(newRules.startingScore) : startingScore || 0;
  const scoringSystemValue = newRules.scoringSystem || scoringSystem;
  const minTeamSizeValue = 'minTeamSize' in newRules ? Number(newRules.minTeamSize) : minTeamSize || 1;
  const maxTeamSizeValue = 'maxTeamSize' in newRules ? Number(newRules.maxTeamSize) : maxTeamSize || 1;

  if (winningScoreEnabledValue && scoringSystemValue === 'increase' && winningScoreValue < startingScoreValue) {
    payloadUpdated.scoringSystem = 'decrease';
  } else if (winningScoreEnabledValue && scoringSystemValue === 'decrease' && winningScoreValue > startingScoreValue) {
    payloadUpdated.scoringSystem = 'increase';
  }

  if (newRules.isMatchesBased) {
    payloadUpdated.startingScore = 0;
    payloadUpdated.scoringSystem = 'increase';
  }
  if (matchBasedEnabled && winningScoreEnabledValue && winningScoreValue < 1) {
    payloadUpdated.winningScore = 1;
  }

  if (newRules.minTeamSize && teams < Number(newRules.minTeamSize)) {
    payloadUpdated.teams = Number(newRules.minTeamSize);
  }
  if (newRules.maxTeamSize && teams > Number(newRules.maxTeamSize)) {
    payloadUpdated.teams = Number(newRules.maxTeamSize);
  }

  if (minTeamSizeValue < 1) {
    payloadUpdated.minTeamSize = 1;
  }
  if (minTeamSizeValue > maxTeamSizeValue) {
    payloadUpdated.maxTeamSize = minTeamSizeValue;
  }
  if (maxTeamSizeValue < 1) {
    payloadUpdated.maxTeamSize = 1;
  }
  if (maxTeamSizeValue > 12) {
    payloadUpdated.maxTeamSize = 12;
  }

  payloadUpdated.startingScore =
    'startingScore' in payloadUpdated ? Number(payloadUpdated.startingScore) : startingScoreValue;
  payloadUpdated.minTeamSize = 'minTeamSize' in payloadUpdated ? Number(payloadUpdated.minTeamSize) : minTeamSizeValue;
  payloadUpdated.maxTeamSize = 'maxTeamSize' in payloadUpdated ? Number(payloadUpdated.maxTeamSize) : maxTeamSizeValue;
  payloadUpdated.winningScore =
    'winningScore' in payloadUpdated ? Number(payloadUpdated.winningScore) : winningScoreValue;

  return {
    type: RULES,
    payload: payloadUpdated,
  };
};

export const completeStepAction = (
  stepsList: string[],
  activeStep: number,
  isValid: boolean,
  completedSteps: number[],
  nextStep?: number
): NewGameActionType => {
  const completedStepsUpdated = stepsList
    .map((_stepName, index) => index)
    .filter(
      (_stepName, index) =>
        (index === activeStep && isValid) || (index !== activeStep && completedSteps.indexOf(index) !== -1)
    );

  if (typeof nextStep === 'number') {
    return {
      type: COMPLETE_STEP,
      payload: {
        completedSteps: completedStepsUpdated,
        activeStep: nextStep,
      },
    };
  }

  if (stepsList.length === activeStep && completedStepsUpdated.length === stepsList.length) {
    return { type: SUBMIT };
  }

  const nextAvailableStep = stepsList
    .map((val, index) => index)
    .filter(val => completedStepsUpdated.indexOf(val) === -1)[0];
  const nextActiveStep = typeof nextAvailableStep === 'number' ? nextAvailableStep : stepsList.length;

  return {
    type: COMPLETE_STEP,
    payload: {
      completedSteps: completedStepsUpdated,
      activeStep: nextActiveStep,
    },
  };
};
