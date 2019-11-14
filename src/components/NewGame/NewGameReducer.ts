import { PlayerColor, ScoringSystem } from './NewGameTypes';

type NewGameActionType = 'SETUP' | 'PLAYERS' | 'COLORS' | 'RULES';

interface NewGameAction {
  type: NewGameActionType;
  payload: any;
}

export interface NewGameState {
  setup: {
    gameName: string;
  };
  players: number;
  playerColors: PlayerColor[];
  rules: {
    startingScore: number;
    winningScore: number;
    winningScoreEnabled: boolean;
    scoringSystem: ScoringSystem;
  };
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
    case 'PLAYERS':
      return {
        ...state,
        players: action.payload.players,
        playerColors: action.payload.playerColors,
      };
    case 'COLORS':
      return {
        ...state,
        playerColors: action.payload,
      };
    case 'RULES':
      return {
        ...state,
        rules: {
          ...state.rules,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};
