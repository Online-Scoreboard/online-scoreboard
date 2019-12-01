import { TeamColor, GameListItem } from '../NewGameTypes';

export const SETUP = 'SETUP';
export const TEAMS = 'TEAMS';
export const COLORS = 'COLORS';
export const RULES = 'RULES';
export const PREDEFINED_RULES = 'PREDEFINED_RULES';
export const COMPLETE_STEP = 'COMPLETE_STEP';
export const SUBMIT = 'SUBMIT';

export interface RulesPayload extends GameListItem {
  teams: number;
  clear?: boolean;
}

interface SetupAction {
  type: typeof SETUP;
  payload: string;
}

interface TeamsAction {
  type: typeof TEAMS;
  payload: {
    teams: number;
    teamColors: TeamColor[];
  };
}

interface ColorsAction {
  type: typeof COLORS;
  payload: TeamColor[];
}

interface RulesAction {
  type: typeof RULES;
  payload: RulesPayload;
}

interface PredefinedRulesAction {
  type: typeof PREDEFINED_RULES;
  payload: RulesPayload;
}

interface CompleteStepRulesAction {
  type: typeof COMPLETE_STEP;
  payload: {
    activeStep: number;
    completedSteps: number[];
  };
}

interface SubmitAction {
  type: typeof SUBMIT;
}

export type NewGameActionType =
  | SetupAction
  | TeamsAction
  | ColorsAction
  | RulesAction
  | PredefinedRulesAction
  | CompleteStepRulesAction
  | SubmitAction;
