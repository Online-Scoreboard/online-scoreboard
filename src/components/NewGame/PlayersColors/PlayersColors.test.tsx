import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { Checkbox } from '@material-ui/core';

import { PlayerColor } from '../NewGameTypes';
import { PlayersColors } from './PlayersColors';

describe('PlayersColors', () => {
  it('should render without crashing', () => {
    const players = 2;
    const colors: PlayerColor[] = ['red', 'white'];
    const playersColors: PlayerColor[] = ['red', 'white'];
    const onPlayersColorsChange = jest.fn();

    shallow(
      <PlayersColors
        players={players}
        colors={colors}
        playersColors={playersColors}
        onPlayersColorsChange={onPlayersColorsChange}
      />
    );

    expect(true).toBeTruthy();
  });

  it('should render a number of check-boxes equal to the number of available colors', () => {
    const players = 3;
    const colors: PlayerColor[] = ['red', 'white', 'black', 'green'];
    const playersColors: PlayerColor[] = ['red', 'white'];
    const onPlayersColorsChange = jest.fn();

    const wrapper = shallow(
      <PlayersColors
        players={players}
        colors={colors}
        playersColors={playersColors}
        onPlayersColorsChange={onPlayersColorsChange}
      />
    );

    expect(wrapper.find(Checkbox).length).toBe(colors.length);
  });

  it('should check the playersColors selected', () => {
    const players = 3;
    const colors: PlayerColor[] = ['red', 'white', 'black', 'green'];
    const playersColors: PlayerColor[] = ['white', 'red'];
    const onPlayersColorsChange = jest.fn();

    const wrapper = shallow(
      <PlayersColors
        players={players}
        colors={colors}
        playersColors={playersColors}
        onPlayersColorsChange={onPlayersColorsChange}
      />
    );
    const checkedPlayers = wrapper
      .find(Checkbox)
      .getElements()
      .filter(el => el.props.checked);

    expect(checkedPlayers.length).toBe(playersColors.length);
  });

  it('should ignore playersColors having wrong names', () => {
    const players = 3;
    const colors: PlayerColor[] = ['red', 'white', 'black', 'green'];
    const playersColors = ['white', 'red', 'ble'] as PlayerColor[];
    const onPlayersColorsChange = jest.fn();

    const wrapper = shallow(
      <PlayersColors
        players={players}
        colors={colors}
        playersColors={playersColors}
        onPlayersColorsChange={onPlayersColorsChange}
      />
    );
    const checkedPlayers = wrapper
      .find(Checkbox)
      .getElements()
      .filter(el => el.props.checked);

    expect(checkedPlayers.length).not.toBe(playersColors.length);
    expect(checkedPlayers.length).toBe(playersColors.length - 1);
  });

  it('should emit an "onPlayersColorsChange" when interacting with the checkboxes', () => {
    const players = 3;
    const colors: PlayerColor[] = ['red', 'white', 'black', 'green'];
    const playersColors: PlayerColor[] = ['white', 'red'];
    const onPlayersColorsChange = jest.fn();

    const wrapper = mount(
      <PlayersColors
        players={players}
        colors={colors}
        playersColors={playersColors}
        onPlayersColorsChange={onPlayersColorsChange}
      />
    );
    const checkbox = wrapper.find(Checkbox).first();

    act(() => {
      checkbox.find('input').simulate('change');
    });

    expect(onPlayersColorsChange).toBeCalledWith(colors[0]);
  });
});
