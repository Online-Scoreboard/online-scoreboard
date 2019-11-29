import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import { Slider } from '@material-ui/core';

import { GameTeams } from './GameTeams';

describe('GameTeams', () => {
  it('should render without crashing', () => {
    const teams = 2;
    const onTeamsChange = jest.fn();

    shallow(<GameTeams teams={teams} onChange={onTeamsChange} />);

    expect(true).toBeTruthy();
  });

  it('should display a Slider', () => {
    const teams = 2;
    const onTeamsChange = jest.fn();

    const wrapper = shallow(<GameTeams teams={teams} onChange={onTeamsChange} />);
    const slider = wrapper.find(Slider);

    expect(slider.exists()).toBe(true);
  });

  it.each`
    teams
    ${1}
    ${2}
    ${9}
    ${10}
    ${11}
    ${13}
  `('should display a Slider positioned to a default value given an initial teams of "$teams"', ({ teams }) => {
    const onTeamsChange = jest.fn();

    const wrapper = shallow(<GameTeams teams={teams} onChange={onTeamsChange} />);
    const slider = wrapper.find(Slider);

    expect(slider.prop('defaultValue')).toBe(teams);
  });

  it('should emit a "onTeamsChange" event when interacting with the slider', () => {
    const teams = 2;
    const testValue = 5;
    const onTeamsChange = jest.fn();

    const wrapper = shallow(<GameTeams teams={teams} onChange={onTeamsChange} />);
    const slider = wrapper.find(Slider);

    act(() => {
      slider.simulate('change', {}, testValue);
    });

    expect(onTeamsChange).toBeCalledWith(testValue);
  });

  it('should not emit any "onTeamsChange" event when the value is an array', () => {
    const teams = 2;
    const testValue = [5];
    const onTeamsChange = jest.fn();

    const wrapper = shallow(<GameTeams teams={teams} onChange={onTeamsChange} />);
    const slider = wrapper.find(Slider);

    act(() => {
      slider.simulate('change', {}, testValue);
    });

    expect(onTeamsChange).not.toBeCalled();
  });
});
