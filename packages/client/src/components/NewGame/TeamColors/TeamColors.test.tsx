import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { Checkbox } from '@material-ui/core';

import { TeamColor } from '../NewGameTypes';
import { TeamColors } from './TeamColors';

describe('TeamColors', () => {
  it('should render without crashing', () => {
    const teams = 2;
    const colors: TeamColor[] = ['red', 'white'];
    const teamColors: TeamColor[] = ['red', 'white'];
    const onTeamColorsChange = jest.fn();

    shallow(<TeamColors teams={teams} colors={colors} teamColors={teamColors} onChange={onTeamColorsChange} />);

    expect(true).toBeTruthy();
  });

  it('should render a number of check-boxes equal to the number of available colors', () => {
    const teams = 3;
    const colors: TeamColor[] = ['red', 'white', 'black', 'green'];
    const teamColors: TeamColor[] = ['red', 'white'];
    const onTeamColorsChange = jest.fn();

    const wrapper = shallow(
      <TeamColors teams={teams} colors={colors} teamColors={teamColors} onChange={onTeamColorsChange} />
    );

    expect(wrapper.find(Checkbox).length).toBe(colors.length);
  });

  it('should check the teamColors selected', () => {
    const teams = 3;
    const colors: TeamColor[] = ['red', 'white', 'black', 'green'];
    const teamColors: TeamColor[] = ['white', 'red'];
    const onTeamColorsChange = jest.fn();

    const wrapper = shallow(
      <TeamColors teams={teams} colors={colors} teamColors={teamColors} onChange={onTeamColorsChange} />
    );
    const checkedTeams = wrapper
      .find(Checkbox)
      .getElements()
      .filter(el => el.props.checked);

    expect(checkedTeams.length).toBe(teamColors.length);
  });

  it('should ignore teamColors having wrong names', () => {
    const teams = 3;
    const colors: TeamColor[] = ['red', 'white', 'black', 'green'];
    const teamColors = ['white', 'red', 'ble'] as TeamColor[];
    const onTeamColorsChange = jest.fn();

    const wrapper = shallow(
      <TeamColors teams={teams} colors={colors} teamColors={teamColors} onChange={onTeamColorsChange} />
    );
    const checkedTeams = wrapper
      .find(Checkbox)
      .getElements()
      .filter(el => el.props.checked);

    expect(checkedTeams.length).not.toBe(teamColors.length);
    expect(checkedTeams.length).toBe(teamColors.length - 1);
  });

  it('should emit an "onTeamColorsChange" when interacting with the checkBoxes', () => {
    const teams = 3;
    const colors: TeamColor[] = ['red', 'white', 'black', 'green'];
    const teamColors: TeamColor[] = ['white', 'red'];
    const onTeamColorsChange = jest.fn();

    const wrapper = mount(
      <TeamColors teams={teams} colors={colors} teamColors={teamColors} onChange={onTeamColorsChange} />
    );
    const checkbox = wrapper.find(Checkbox).first();

    act(() => {
      checkbox.find('input').simulate('change');
    });

    expect(onTeamColorsChange).toBeCalledWith(colors[0]);
  });
});
