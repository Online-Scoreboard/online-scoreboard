import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { NewGameComponent } from './NewGameComponent';
import { GamePlayers } from './GamePlayers';
import { PlayerColor } from './NewGameTypes';

describe('NewGameComponent', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(msg => {
      if (msg !== 'Warning: [JSS] Could not find the referenced rule "checked" in "makeStyles".') {
        console.log(msg);
      }
    });
  });

  it('should render without crashing', () => {
    const newGame = jest.fn();

    shallow(<NewGameComponent newGameLoading={false} newGame={newGame} />);

    expect(true).toBeTruthy();
  });

  describe('handlePlayersChange', () => {
    const newGame = jest.fn();

    it('should set some default players', () => {
      const expectedPlayers = 2;
      const expectedPlayersColors: PlayerColor[] = ['black', 'white'];

      const wrapper = shallow(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      const players = wrapper.find(GamePlayers).prop('players');
      const playersColors = wrapper.find(GamePlayers).prop('playersColors');

      expect(players).toBe(expectedPlayers);
      expect(playersColors).toEqual(expectedPlayersColors);
    });

    it('should fail to select a third player color when only 2 players/teams are selected for the game', () => {
      const expectedPlayers = 2;
      const expectedPlayersColors: PlayerColor[] = ['black', 'white'];
      const newPlayerColor: PlayerColor = 'lime';

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        wrapper.find(GamePlayers).prop('onPlayersColorsChange')(newPlayerColor);
      });

      wrapper.update();

      expect(wrapper.find(GamePlayers).prop('players')).toBe(expectedPlayers);
      expect(wrapper.find(GamePlayers).prop('playersColors')).toEqual(expectedPlayersColors);
    });

    it('should remove any extra selected players color when reducing the players/teams size', () => {
      const defaultPlayersColors: PlayerColor[] = ['black', 'white'];
      const newPlayers = 3;
      const expectedPlayers = 2;
      const newPlayerColor: PlayerColor = 'lime';

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        wrapper.find(GamePlayers).prop('onPlayersChange')(newPlayers);
      });

      wrapper.update();

      act(() => {
        wrapper.find(GamePlayers).prop('onPlayersColorsChange')(newPlayerColor);
      });

      wrapper.update();

      act(() => {
        wrapper.find(GamePlayers).prop('onPlayersChange')(expectedPlayers);
      });

      wrapper.update();

      expect(wrapper.find(GamePlayers).prop('players')).toBe(expectedPlayers);
      expect(wrapper.find(GamePlayers).prop('playersColors')).toEqual(defaultPlayersColors);
    });

    it('should select some new players colors when increasing the players/teams size', () => {
      const newPlayers = 3;

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        wrapper.find(GamePlayers).prop('onPlayersChange')(newPlayers);
      });

      wrapper.update();

      expect(wrapper.find(GamePlayers).prop('players')).toBe(newPlayers);
      expect(wrapper.find(GamePlayers).prop('playersColors').length).toBe(newPlayers);
    });

    it('should allow removing a third player color when 3 players/teams are selected for the game', () => {
      const newPlayers = 3;
      const removedColor: PlayerColor = 'white';
      const expectedPlayers = 3;
      const expectedColors: PlayerColor[] = ['black', 'purple'];

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        wrapper.find(GamePlayers).prop('onPlayersChange')(newPlayers);
      });

      wrapper.update();

      act(() => {
        wrapper.find(GamePlayers).prop('onPlayersColorsChange')(removedColor);
      });

      wrapper.update();

      expect(wrapper.find(GamePlayers).prop('players')).toBe(expectedPlayers);
      expect(wrapper.find(GamePlayers).prop('playersColors')).toEqual(expectedColors);
    });
  });
});
