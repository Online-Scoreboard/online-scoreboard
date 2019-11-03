import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import { Slider } from '@material-ui/core';

import { GamePlayers } from './GamePlayers';

describe('GamePlayers', () => {
  it('should render without crashing', () => {
    const players = 2;
    const onPlayersChange = jest.fn();

    shallow(<GamePlayers players={players} onChange={onPlayersChange} />);

    expect(true).toBeTruthy();
  });

  it('should display a Slider', () => {
    const players = 2;
    const onPlayersChange = jest.fn();

    const wrapper = shallow(<GamePlayers players={players} onChange={onPlayersChange} />);
    const slider = wrapper.find(Slider);

    expect(slider.exists()).toBe(true);
  });

  it.each`
    players
    ${1}
    ${2}
    ${9}
    ${10}
    ${11}
    ${13}
  `('should display a Slider positioned to a default value given an initial players of "$players"', ({ players }) => {
    const onPlayersChange = jest.fn();

    const wrapper = shallow(<GamePlayers players={players} onChange={onPlayersChange} />);
    const slider = wrapper.find(Slider);

    expect(slider.prop('defaultValue')).toBe(players);
  });

  it('should emit a "onPlayersChange" event when interacting with the slider', () => {
    const players = 2;
    const testValue = 5;
    const onPlayersChange = jest.fn();

    const wrapper = shallow(<GamePlayers players={players} onChange={onPlayersChange} />);
    const slider = wrapper.find(Slider);

    act(() => {
      slider.simulate('change', {}, testValue);
    });

    expect(onPlayersChange).toBeCalledWith(testValue);
  });

  it('should not emit any "onPlayersChange" event when the value is an array', () => {
    const players = 2;
    const testValue = [5];
    const onPlayersChange = jest.fn();

    const wrapper = shallow(<GamePlayers players={players} onChange={onPlayersChange} />);
    const slider = wrapper.find(Slider);

    act(() => {
      slider.simulate('change', {}, testValue);
    });

    expect(onPlayersChange).not.toBeCalled();
  });
});
