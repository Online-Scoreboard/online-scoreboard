import { TeamColor, ScoringSystem } from './NewGameTypes';

type NewGameActionType = 'SETUP' | 'TEAMS' | 'COLORS' | 'RULES' | 'SUBMIT' | 'COMPLETE_STEP';

interface NewGameAction {
  type: NewGameActionType;
  payload?: any;
}

export interface NewGameState {
  setup: {
    gameName: string;
  };
  teams: number;
  teamColors: TeamColor[];
  rules: {
    startingScore: number;
    winningScore: number;
    winningScoreEnabled: boolean;
    scoringSystem: ScoringSystem;
  };
  steps: {
    active: number;
    completed: number[];
  };
  gameSubmitted: boolean;
  error: boolean;
}

export const newGameReducer = (state: NewGameState, action: NewGameAction): NewGameState => {
  switch (action.type) {
    case 'SETUP':
      return {
        ...state,
        setup: {
          gameName: action.payload,
        },
      };
    case 'TEAMS':
      return {
        ...state,
        teams: action.payload.teams,
        teamColors: action.payload.teamColors,
      };
    case 'COLORS':
      return {
        ...state,
        teamColors: action.payload,
      };
    case 'RULES':
      return {
        ...state,
        rules: {
          ...state.rules,
          ...action.payload,
        },
      };
    case 'SUBMIT': {
      const nextStep = state.steps.active + 1;

      return {
        ...state,
        gameSubmitted: true,
        steps: {
          ...state.steps,
          active: nextStep,
        },
      };
    }
    case 'COMPLETE_STEP': {
      return {
        ...state,
        steps: {
          active: action.payload.activeStep,
          completed: action.payload.completedSteps,
        },
      };
    }
    default:
      return state;
  }
};
