import { PlayerColor } from './NewGameTypes';

type NewGameActionType = 'SETUP' | 'PLAYERS' | 'COLORS';

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
    default:
      return state;
  }
};
