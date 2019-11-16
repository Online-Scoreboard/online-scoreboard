import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { Component as NewGameComponent } from './NewGameComponent';
import { GameTeams } from './GameTeams';
import { Stepper } from './Stepper';
import { GameName } from './GameName';
import { TeamColors } from './TeamColors';
import { TeamColor } from './NewGameTypes';
import * as NewGameConstants from './NewGameConstants';

jest.mock('./NewGameConstants', () => jest.requireActual('./NewGameConstants'));

describe('NewGameComponent', () => {
  const newGame = jest.fn();

  it('should render without crashing', () => {
    const newGame = jest.fn();

    shallow(<NewGameComponent newGameLoading={false} newGame={newGame} />);

    expect(true).toBeTruthy();
  });

  describe('Stepper', () => {
    it('should render a Stepper component', () => {
      const wrapper = shallow(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      const stepper = wrapper.find(Stepper);

      expect(stepper.exists()).toBe(true);
    });

    it('should render a Stepper initialized to the first step', () => {
      const expectedActiveStep = 0;

      const wrapper = shallow(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      const stepper = wrapper.find(Stepper);
      const activeStep = stepper.prop('activeStep');

      expect(activeStep).toBe(expectedActiveStep);
    });
  });

  describe('Navigation buttons', () => {
    it('should have a "previous" and a "next" step navigation buttons', () => {
      const wrapper = shallow(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      const prevButton = wrapper.find('.prevStep');
      const nextButton = wrapper.find('.nextStep');

      expect(prevButton.exists()).toBe(true);
      expect(nextButton.exists()).toBe(true);
    });

    it('should have both the "previous" and the "next" step navigation buttons disabled on the first step', () => {
      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      const prevButton = wrapper.find('.prevStep');
      const nextButton = wrapper.find('.nextStep');

      expect(prevButton.find('button').prop('disabled')).toBe(true);
      expect(nextButton.find('button').prop('disabled')).toBe(true);
    });

    it('should have the "previous" step navigation buttons enabled on the second step', () => {
      const startingStep = 1;
      jest.spyOn(NewGameConstants, 'getStartingStep').mockImplementationOnce(() => startingStep);

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      const prevButton = wrapper.find('.prevStep');

      expect(prevButton.find('button').prop('disabled')).toBe(false);
    });

    it('should allow going back from the step 2 to 1', () => {
      const startingStep = 1;
      const expectedStep = 0;

      jest.spyOn(NewGameConstants, 'getStartingStep').mockImplementationOnce(() => startingStep);

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        wrapper
          .find('.prevStep')
          .find('button')
          .simulate('click');
      });

      wrapper.update();

      const stepper = wrapper.find(Stepper);
      expect(stepper.prop('activeStep')).toBe(expectedStep);
    });
  });

  describe('GameName', () => {
    it('should render a GameName content in the initial active step', () => {
      const wrapper = shallow(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      const gameName = wrapper.find(GameName);
      const gameTeams = wrapper.find(GameTeams);

      expect(gameName.exists()).toBe(true);
      expect(gameTeams.exists()).not.toBe(true);
    });

    it('should update the reducer when updating the game name', () => {
      const testGameName = 'testGameName';
      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        const gameName = wrapper.find(GameName);
        gameName.props().onChange(testGameName);
      });

      wrapper.update();

      const res = wrapper.find(GameName).prop('gameName');
      expect(res).toBe(testGameName);
    });

    it('should disabled the "next" step navigation button when the game name is too short', () => {
      const testGameName = 'test';
      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        const gameName = wrapper.find(GameName);
        gameName.props().onChange(testGameName);
      });

      wrapper.update();

      const prevButton = wrapper.find('.prevStep');
      const nextButton = wrapper.find('.nextStep');

      expect(prevButton.find('button').prop('disabled')).toBe(true);
      expect(nextButton.find('button').prop('disabled')).toBe(true);
    });

    it('should disabled the "next" step navigation button when the game name is too long', () => {
      const testGameName = 'names longer than 30 characters will be invalid';
      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        const gameName = wrapper.find(GameName);
        gameName.props().onChange(testGameName);
      });

      wrapper.update();

      const prevButton = wrapper.find('.prevStep');
      const nextButton = wrapper.find('.nextStep');

      expect(prevButton.find('button').prop('disabled')).toBe(true);
      expect(nextButton.find('button').prop('disabled')).toBe(true);
    });

    it('should enable the "next" step navigation button once the game name is valid', () => {
      const testGameName = 'testGameName';
      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        const gameName = wrapper.find(GameName);
        gameName.props().onChange(testGameName);
      });

      wrapper.update();

      const prevButton = wrapper.find('.prevStep');
      const nextButton = wrapper.find('.nextStep');

      expect(prevButton.find('button').prop('disabled')).toBe(true);
      expect(nextButton.find('button').prop('disabled')).toBe(false);
    });
  });

  describe('GameTeams', () => {
    it('should render the GameTeams component as a third step', () => {
      const startingStep = 2;
      jest.spyOn(NewGameConstants, 'getStartingStep').mockImplementationOnce(() => startingStep);

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      const gameName = wrapper.find(GameName);
      const gameTeams = wrapper.find(GameTeams);

      expect(gameTeams.exists()).toBe(true);
      expect(gameName.exists()).not.toBe(true);
    });

    it('should update the reducer when updating the number of teams', () => {
      const startingStep = 2;
      jest.spyOn(NewGameConstants, 'getStartingStep').mockImplementationOnce(() => startingStep);
      const testTeams = 11;

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        const gameTeams = wrapper.find(GameTeams);
        gameTeams.props().onChange(testTeams);
      });

      wrapper.update();

      const res = wrapper.find(GameTeams).prop('teams');
      expect(res).toBe(testTeams);
    });

    it('should not update the reducer when the updated number of teams is not changed', () => {
      const startingStep = 2;
      jest.spyOn(NewGameConstants, 'getStartingStep').mockImplementationOnce(() => startingStep);
      const testTeams = NewGameConstants.getDefaultTeams();

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        const gameTeams = wrapper.find(GameTeams);
        gameTeams.props().onChange(testTeams);
      });

      wrapper.update();

      const res = wrapper.find(GameTeams).prop('teams');
      expect(res).toBe(testTeams);
    });
  });

  describe('TeamColors', () => {
    it('should render the TeamColors component as a third step', () => {
      const startingStep = 3;
      jest.spyOn(NewGameConstants, 'getStartingStep').mockImplementationOnce(() => startingStep);

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      const teamColors = wrapper.find(TeamColors);
      expect(teamColors.exists()).toBe(true);
    });

    it('should add a new team color', () => {
      const startingStep = 3;
      const testTeams = 3;
      const testTeamColor: TeamColor = 'green';
      const defaultTeamColors = NewGameConstants.getDefaultTeamColors();

      jest.spyOn(NewGameConstants, 'getDefaultTeams').mockImplementationOnce(() => testTeams);
      jest.spyOn(NewGameConstants, 'getStartingStep').mockImplementationOnce(() => startingStep);

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        const teamColors = wrapper.find(TeamColors);
        teamColors.props().onChange(testTeamColor);
      });

      wrapper.update();

      const res = wrapper.find(TeamColors).prop('teamColors');
      expect(res).toEqual([...defaultTeamColors, testTeamColor]);
    });

    it('should remove an existing team color', () => {
      const startingStep = 3;
      const testTeams = 2;
      const defaultTeamColors = NewGameConstants.getDefaultTeamColors();
      const testTeamColor: TeamColor = defaultTeamColors[0];
      const expectedTeamColors = defaultTeamColors.filter((_color, index) => index > 0);

      jest.spyOn(NewGameConstants, 'getDefaultTeams').mockImplementationOnce(() => testTeams);
      jest.spyOn(NewGameConstants, 'getStartingStep').mockImplementationOnce(() => startingStep);

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        const teamColors = wrapper.find(TeamColors);
        teamColors.props().onChange(testTeamColor);
      });

      wrapper.update();

      const res = wrapper.find(TeamColors).prop('teamColors');
      expect(res).toEqual(expectedTeamColors);
    });

    it('should not allow adding other colors when the maximum number of chosen teams is already reached', () => {
      const startingStep = 3;
      const testTeams = 2;
      const defaultTeamColors = NewGameConstants.getDefaultTeamColors();
      const testColor: TeamColor = 'red';

      jest.spyOn(NewGameConstants, 'getDefaultTeams').mockImplementationOnce(() => testTeams);
      jest.spyOn(NewGameConstants, 'getStartingStep').mockImplementationOnce(() => startingStep);

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        const teamColors = wrapper.find(TeamColors);
        teamColors.props().onChange(testColor);
      });

      wrapper.update();

      const res = wrapper.find(TeamColors).prop('teamColors');
      expect(res).toEqual(defaultTeamColors);
    });
  });
});
