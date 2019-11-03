import { useReducer, useCallback } from 'react';
import { newGameReducer, NewGameState } from '../NewGameReducer';
import {
  getDefaultPlayers,
  getDefaultPlayerColors,
  getColors,
  getMinGameNameLength,
  getMaxGameNameLength,
} from '../NewGameConstants';
import { PlayerColor } from '../NewGameTypes';

const getInitialState = (): NewGameState => ({
  setup: {
    gameName: '',
  },
  players: getDefaultPlayers(),
  playerColors: getDefaultPlayerColors(),
});

export const useNewGame = () => {
  const initialState = getInitialState();
  const [state, dispatch] = useReducer(newGameReducer, initialState);

  const handleGameNameChange = useCallback((value: string) => {
    dispatch({ type: 'SETUP', payload: value });
  }, []);

  const handlePlayerColorsChange = useCallback(
    (playerColor: PlayerColor) => {
      const { playerColors, players } = state;

      if (playerColors.indexOf(playerColor) >= 0) {
        const newPlayerColors = playerColors.filter(color => color !== playerColor);
        dispatch({ type: 'COLORS', payload: newPlayerColors });
        return;
      }

      if (playerColors.length >= players) {
        return;
      }

      const newPlayerColors = [...playerColors, playerColor];
      dispatch({ type: 'COLORS', payload: newPlayerColors });
    },
    [state]
  );

  const handlePlayersChange = useCallback(
    (newPlayers: number) => {
      const { playerColors, players } = state;
      const colors = getColors();
      let newPlayerColors = playerColors;

      if (newPlayers === players) {
        return;
      }

      if (newPlayers === playerColors.length) {
        dispatch({
          type: 'PLAYERS',
          payload: {
            players: newPlayers,
          },
        });

        return;
      }

      if (newPlayers <= playerColors.length) {
        newPlayerColors = playerColors.slice(0, newPlayers);
      }

      if (newPlayers > playerColors.length) {
        const availableColors = colors.filter(playerColor => playerColors.indexOf(playerColor) === -1).reverse();

        newPlayerColors = new Array(newPlayers - playerColors.length)
          .fill(true)
          .reduce(totPlayers => [...totPlayers, availableColors.pop()], playerColors);
      }

      dispatch({
        type: 'PLAYERS',
        payload: {
          players: newPlayers,
          playerColors: newPlayerColors,
        },
      });
    },
    [state]
  );

  const checkStep = useCallback(
    (step: number): boolean => {
      const { setup, players, playerColors } = state;
      const minGameNameLength = getMinGameNameLength();
      const maxGameNameLength = getMaxGameNameLength();

      switch (step) {
        case 0: {
          return Boolean(
            setup.gameName && setup.gameName.length >= minGameNameLength && setup.gameName.length < maxGameNameLength
          );
        }
        case 1: {
          return true;
        }
        case 2: {
          return playerColors.length === players;
        }
        default: {
          return false;
        }
      }
    },
    [state]
  );

  const getValidationNotes = useCallback(
    (step: number): string => {
      const { setup, players, playerColors } = state;
      const minGameNameLength = getMinGameNameLength();
      const maxGameNameLength = getMaxGameNameLength();

      switch (step) {
        case 0: {
          const diff = minGameNameLength - setup.gameName.length;
          const overFlow = setup.gameName.length - maxGameNameLength;

          if (diff > 0) {
            return `Minimum name of ${minGameNameLength} characters. You must enter at lease ${diff} more characters`;
          } else if (overFlow >= 0) {
            return `Ops! That name is too long. A maximum of ${maxGameNameLength} characters is allowed`;
          }
          return 'Your game name looks amazing!';
        }
        case 1: {
          return 'You can chose between 1 and 12 players/teams';
        }
        case 2: {
          const diff = players - playerColors.length;

          if (diff > 0) {
            return `You must chose ${diff} more color${diff > 1 ? 's' : ''}`;
          }
          return 'All your players have a color!';
        }
        default: {
          return '';
        }
      }
    },
    [state]
  );

  return {
    state,
    onGameNameChange: handleGameNameChange,
    onPlayerColorsChange: handlePlayerColorsChange,
    onPlayersChange: handlePlayersChange,
    getValidationNotes,
    checkStep,
  };
};