import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Autocomplete } from '@material-ui/lab';

import { GameRules } from './GameRules';
import { GameListItem } from '../NewGameTypes';
import { TextField } from '@material-ui/core';

describe('GameRules', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const rules: GameListItem = {
    name: 'testRule',
    minTeamSize: 0,
    maxTeamSize: 0,
    startingScore: 0,
    winningScore: 0,
    winningScoreEnabled: false,
    scoringSystem: 'increase',
    isMatchesBased: false,
  };
  const onChange = jest.fn();
  const onGameRuleChange = jest.fn();

  it('should render without crashing', () => {
    shallow(<GameRules rules={rules} onChange={onChange} onGameRuleChange={onGameRuleChange} />);

    expect(true).toBeTruthy();
  });

  it('should return a Game Rules component', () => {
    const wrapper = mount(<GameRules rules={rules} onChange={onChange} onGameRuleChange={onGameRuleChange} />);

    expect(
      wrapper
        .find('.newGameTitle')
        .first()
        .text()
    ).toBe('Game Rules');
  });

  it('should emit an onChange event and clear when changing the basic game rules', () => {
    const expectedGameRuleChange = { clear: true };

    const wrapper = mount(<GameRules rules={rules} onChange={onChange} onGameRuleChange={onGameRuleChange} />);

    act(() => {
      const gameRules = wrapper.find(Autocomplete);
      const handleRulesChange: any = gameRules.prop('onChange');
      handleRulesChange(null);
    });

    expect(onChange).toBeCalledWith(expectedGameRuleChange);
  });

  it('should emit an onGameRuleChange event containing the rule name when choosing an existing basic rule', () => {
    const gameRulesName = 'Chess';

    const wrapper = mount(<GameRules rules={rules} onChange={onChange} onGameRuleChange={onGameRuleChange} />);

    act(() => {
      const gameRules = wrapper.find(Autocomplete);
      const handleRulesChange: any = gameRules.prop('onChange');
      handleRulesChange({}, gameRulesName);
    });

    expect(onGameRuleChange).toBeCalledWith(gameRulesName);
  });

  it('should emit a onChange event when the user interacts with the rules', () => {
    const wrapper = mount(<GameRules rules={rules} onChange={onChange} onGameRuleChange={onGameRuleChange} />);

    act(() => {
      const startingScore = wrapper.find(TextField).filter('.startingScore');
      startingScore.find('input').simulate('change');
    });

    expect(onChange).toBeCalledWith({ startingScore: `${rules.startingScore}` });
  });
});
