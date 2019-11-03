import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { Checkbox } from '@material-ui/core';

import { PlayerColor } from '../NewGameTypes';
import { PlayerColors } from './PlayerColors';

describe('PlayerColors', () => {
  it('should render without crashing', () => {
    const players = 2;
    const colors: PlayerColor[] = ['red', 'white'];
    const playerColors: PlayerColor[] = ['red', 'white'];
    const onPlayerColorsChange = jest.fn();

    shallow(
      <PlayerColors players={players} colors={colors} playerColors={playerColors} onChange={onPlayerColorsChange} />
    );

    expect(true).toBeTruthy();
  });

  it('should render a number of check-boxes equal to the number of available colors', () => {
    const players = 3;
    const colors: PlayerColor[] = ['red', 'white', 'black', 'green'];
    const playerColors: PlayerColor[] = ['red', 'white'];
    const onPlayerColorsChange = jest.fn();

    const wrapper = shallow(
      <PlayerColors players={players} colors={colors} playerColors={playerColors} onChange={onPlayerColorsChange} />
    );

    expect(wrapper.find(Checkbox).length).toBe(colors.length);
  });

  it('should check the playerColors selected', () => {
    const players = 3;
    const colors: PlayerColor[] = ['red', 'white', 'black', 'green'];
    const playerColors: PlayerColor[] = ['white', 'red'];
    const onPlayerColorsChange = jest.fn();

    const wrapper = shallow(
      <PlayerColors players={players} colors={colors} playerColors={playerColors} onChange={onPlayerColorsChange} />
    );
    const checkedPlayers = wrapper
      .find(Checkbox)
      .getElements()
      .filter(el => el.props.checked);

    expect(checkedPlayers.length).toBe(playerColors.length);
  });

  it('should ignore playerColors having wrong names', () => {
    const players = 3;
    const colors: PlayerColor[] = ['red', 'white', 'black', 'green'];
    const playerColors = ['white', 'red', 'ble'] as PlayerColor[];
    const onPlayerColorsChange = jest.fn();

    const wrapper = shallow(
      <PlayerColors players={players} colors={colors} playerColors={playerColors} onChange={onPlayerColorsChange} />
    );
    const checkedPlayers = wrapper
      .find(Checkbox)
      .getElements()
      .filter(el => el.props.checked);

    expect(checkedPlayers.length).not.toBe(playerColors.length);
    expect(checkedPlayers.length).toBe(playerColors.length - 1);
  });

  it('should emit an "onPlayerColorsChange" when interacting with the checkboxes', () => {
    const players = 3;
    const colors: PlayerColor[] = ['red', 'white', 'black', 'green'];
    const playerColors: PlayerColor[] = ['white', 'red'];
    const onPlayerColorsChange = jest.fn();

    const wrapper = mount(
      <PlayerColors players={players} colors={colors} playerColors={playerColors} onChange={onPlayerColorsChange} />
    );
    const checkbox = wrapper.find(Checkbox).first();

    act(() => {
      checkbox.find('input').simulate('change');
    });

    expect(onPlayerColorsChange).toBeCalledWith(colors[0]);
  });
});
