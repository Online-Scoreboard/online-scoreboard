import { TeamColor, GameListItem } from '../NewGameTypes';
import {
  NewGameActionType,
  SETUP,
  TEAMS,
  COLORS,
  RULES,
  PREDEFINED_RULES,
  COMPLETE_STEP,
  SUBMIT,
} from './NewGameActionTypes';

export interface NewGameState {
  setup: {
    gameName: string;
  };
  teams: number;
  teamColors: TeamColor[];
  rules: GameListItem;
  steps: {
    active: number;
    completed: number[];
  };
  gameSubmitted: boolean;
  error: boolean;
}

export const newGameReducer = (state: NewGameState, action: NewGameActionType): NewGameState => {
  switch (action.type) {
    case SETUP:
      return {
        ...state,
        setup: {
          gameName: action.payload,
        },
      };
    case TEAMS:
      return {
        ...state,
        teams: action.payload.teams,
        teamColors: action.payload.teamColors,
      };
    case COLORS:
      return {
        ...state,
        teamColors: action.payload,
      };
    case RULES:
      return {
        ...state,
        rules: {
          ...state.rules,
          ...action.payload,
          name: '',
        },
        teams: action.payload.teams,
      };
    case PREDEFINED_RULES: {
      if (!action.payload) {
        return state;
      }

      const { teams, ...rules } = action.payload;

      return {
        ...state,
        rules,
        teams,
      };
    }
    case COMPLETE_STEP: {
      return {
        ...state,
        steps: {
          active: action.payload.activeStep,
          completed: action.payload.completedSteps,
        },
      };
    }
    case SUBMIT: {
      return {
        ...state,
        gameSubmitted: true,
        steps: {
          ...state.steps,
          active: state.steps.active + 1,
        },
      };
    }
    default:
      return state;
  }
};
