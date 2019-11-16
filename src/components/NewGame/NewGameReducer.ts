import { TeamColor, GameListItem } from './NewGameTypes';

type NewGameActionType = 'SETUP' | 'TEAMS' | 'COLORS' | 'RULES' | 'PREDEFINED_RULES' | 'SUBMIT' | 'COMPLETE_STEP';

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
  rules: GameListItem;
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
          name: '',
        },
        teams: action.payload.teams,
      };
    case 'PREDEFINED_RULES': {
      if (!action.payload) {
        return state;
      }

      return {
        ...state,
        rules: {
          ...action.payload,
        },
        teams: action.payload.teams,
      };
    }
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
