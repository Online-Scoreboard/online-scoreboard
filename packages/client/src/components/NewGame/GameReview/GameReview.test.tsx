import React from 'react';
import { shallow } from 'enzyme';

import { GameReview } from './GameReview';
import { TeamColor } from '../NewGameTypes';

describe('GameReview', () => {
  it('should render without crashing', () => {
    const gameName = '';
    const rules = {} as any;
    const teams = 2;
    const teamColors: TeamColor[] = ['red', 'purple'];

    shallow(<GameReview gameName={gameName} rules={rules} teams={teams} teamColors={teamColors} />);

    expect(true).toBeTruthy();
  });

  it('should show the given game name', () => {
    const gameName = 'My test game';
    const rules = {} as any;
    const teams = 2;
    const teamColors: TeamColor[] = ['red', 'purple'];
    const wrapper = shallow(<GameReview gameName={gameName} rules={rules} teams={teams} teamColors={teamColors} />);

    const gameNameEl = wrapper.find('.gameName');
    expect(gameNameEl.text()).toBe(gameName);
  });

  it('should show the provided game rules template', () => {
    const gameName = '';
    const rules = { name: 'My game template' } as any;
    const teams = 2;
    const teamColors: TeamColor[] = ['red', 'purple'];
    const wrapper = shallow(<GameReview gameName={gameName} rules={rules} teams={teams} teamColors={teamColors} />);
    const expectedGameTemplate = `"${rules.name}" has been used for setting this game rules`;

    const gameTemplate = wrapper.find('.gameTemplate');
    expect(gameTemplate.text()).toBe(expectedGameTemplate);
  });

  it('should tell when the user entered a custom game rules', () => {
    const gameName = '';
    const rules = { name: '' } as any;
    const teams = 2;
    const teamColors: TeamColor[] = ['red', 'purple'];
    const wrapper = shallow(<GameReview gameName={gameName} rules={rules} teams={teams} teamColors={teamColors} />);
    const expectedGameTemplate = `A custom configuration has been used for setting this game rules`;

    const gameTemplate = wrapper.find('.gameTemplate');
    expect(gameTemplate.text()).toBe(expectedGameTemplate);
  });

  it('should show the given number of teams', () => {
    const gameName = '';
    const rules = {} as any;
    const teams = 2;
    const teamColors: TeamColor[] = ['red', 'purple'];
    const wrapper = shallow(<GameReview gameName={gameName} rules={rules} teams={teams} teamColors={teamColors} />);
    const expectedGameTeams = `${teams} teams`;

    const gameTeams = wrapper.find('.teams');
    expect(gameTeams.text()).toBe(expectedGameTeams);
  });

  it('should show the given team colors', () => {
    const gameName = '';
    const rules = {} as any;
    const teams = 2;
    const teamColors: TeamColor[] = ['red', 'purple'];
    const wrapper = shallow(<GameReview gameName={gameName} rules={rules} teams={teams} teamColors={teamColors} />);

    const colors = wrapper.find('.teamColors');
    expect(colors.find('.teamColor').length).toBe(2);
    expect(
      colors
        .find('.teamColor')
        .at(0)
        .hasClass(`teamColor-${teamColors[0]}`)
    ).toBe(true);
    expect(
      colors
        .find('.teamColor')
        .at(1)
        .hasClass(`teamColor-${teamColors[1]}`)
    ).toBe(true);
  });

  it('should tell the user when the game is points based', () => {
    const gameName = '';
    const rules = {} as any;
    const teams = 2;
    const teamColors: TeamColor[] = ['red', 'purple'];
    const wrapper = shallow(<GameReview gameName={gameName} rules={rules} teams={teams} teamColors={teamColors} />);
    const expectedMessage = 'This is a points based game';

    const gameMatch = wrapper.find('.gameMatch');
    expect(gameMatch.text()).toBe(expectedMessage);
  });

  it('should tell the user when the game is matches based', () => {
    const gameName = '';
    const rules = { isMatchesBased: true } as any;
    const teams = 2;
    const teamColors: TeamColor[] = ['red', 'purple'];
    const wrapper = shallow(<GameReview gameName={gameName} rules={rules} teams={teams} teamColors={teamColors} />);
    const expectedMessage = 'This is a matches based game';

    const gameMatch = wrapper.find('.gameMatch');
    expect(gameMatch.text()).toBe(expectedMessage);
  });

  it('should tell the user when the score is going to increase', () => {
    const gameName = '';
    const rules = { scoringSystem: 'increase' } as any;
    const teams = 2;
    const teamColors: TeamColor[] = ['red', 'purple'];
    const wrapper = shallow(<GameReview gameName={gameName} rules={rules} teams={teams} teamColors={teamColors} />);
    const expectedMessage = 'The teams score will increase';

    const scoringSystem = wrapper.find('.scoringSystem');
    expect(scoringSystem.text()).toContain(expectedMessage);
  });

  it('should tell the user when the score is going to decrease', () => {
    const gameName = '';
    const rules = { scoringSystem: 'decrease' } as any;
    const teams = 2;
    const teamColors: TeamColor[] = ['red', 'purple'];
    const wrapper = shallow(<GameReview gameName={gameName} rules={rules} teams={teams} teamColors={teamColors} />);
    const expectedMessage = 'The teams score will decrease';

    const scoringSystem = wrapper.find('.scoringSystem');
    expect(scoringSystem.text()).toContain(expectedMessage);
  });

  it('should tell the user when the score is going to increase and decrease', () => {
    const gameName = '';
    const rules = { scoringSystem: 'both' } as any;
    const teams = 2;
    const teamColors: TeamColor[] = ['red', 'purple'];
    const wrapper = shallow(<GameReview gameName={gameName} rules={rules} teams={teams} teamColors={teamColors} />);
    const expectedMessage = 'The teams score will increase and decrease';

    const scoringSystem = wrapper.find('.scoringSystem');
    expect(scoringSystem.text()).toContain(expectedMessage);
  });

  it('should tell the user when the winning score is disabled', () => {
    const gameName = '';
    const rules = { scoringSystem: 'increase', winningScoreEnabled: false, startingScore: 0 } as any;
    const teams = 2;
    const teamColors: TeamColor[] = ['red', 'purple'];
    const wrapper = shallow(<GameReview gameName={gameName} rules={rules} teams={teams} teamColors={teamColors} />);
    const expectedMessage = 'The teams score will increase from 0 points until the end of the game';

    const scoringSystem = wrapper.find('.scoringSystem');
    expect(scoringSystem.text()).toBe(expectedMessage);
  });

  it('should tell the user when the winning score is enabled', () => {
    const gameName = '';
    const rules = { scoringSystem: 'increase', winningScoreEnabled: true, startingScore: 0, winningScore: 10 } as any;
    const teams = 2;
    const teamColors: TeamColor[] = ['red', 'purple'];
    const wrapper = shallow(<GameReview gameName={gameName} rules={rules} teams={teams} teamColors={teamColors} />);
    const expectedMessage = 'The teams score will increase from 0 to 10 points';

    const scoringSystem = wrapper.find('.scoringSystem');
    expect(scoringSystem.text()).toBe(expectedMessage);
  });
});
