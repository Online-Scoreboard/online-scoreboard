import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { Component as NewGameComponent } from './NewGameComponent';
import { GamePlayers } from './GamePlayers';
import { Stepper } from './Stepper';
import { GameName } from './GameName';
import { PlayerColors } from './PlayerColors';
import { PlayerColor } from './NewGameTypes';
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
      const gamePlayers = wrapper.find(GamePlayers);

      expect(gameName.exists()).toBe(true);
      expect(gamePlayers.exists()).not.toBe(true);
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

  describe('GamePlayers', () => {
    it('should render the GamePlayers component as a second step', () => {
      const startingStep = 1;
      jest.spyOn(NewGameConstants, 'getStartingStep').mockImplementationOnce(() => startingStep);

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      const gameName = wrapper.find(GameName);
      const gamePlayers = wrapper.find(GamePlayers);

      expect(gamePlayers.exists()).toBe(true);
      expect(gameName.exists()).not.toBe(true);
    });

    it('should update the reducer when updating the number of players', () => {
      jest.spyOn(NewGameConstants, 'getStartingStep').mockImplementationOnce(() => 1);
      const testPlayers = 11;

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        const gamePlayers = wrapper.find(GamePlayers);
        gamePlayers.props().onChange(testPlayers);
      });

      wrapper.update();

      const res = wrapper.find(GamePlayers).prop('players');
      expect(res).toBe(testPlayers);
    });

    it('should not update the reducer when the updated number of players is not changed', () => {
      jest.spyOn(NewGameConstants, 'getStartingStep').mockImplementationOnce(() => 1);
      const testPlayers = NewGameConstants.getDefaultPlayers();

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        const gamePlayers = wrapper.find(GamePlayers);
        gamePlayers.props().onChange(testPlayers);
      });

      wrapper.update();

      const res = wrapper.find(GamePlayers).prop('players');
      expect(res).toBe(testPlayers);
    });
  });

  describe('PlayerColors', () => {
    it('should render the PlayerColors component as a third step', () => {
      const startingStep = 2;
      jest.spyOn(NewGameConstants, 'getStartingStep').mockImplementationOnce(() => startingStep);

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      const playerColors = wrapper.find(PlayerColors);
      expect(playerColors.exists()).toBe(true);
    });

    it('should add a new player color', () => {
      const startingStep = 2;
      const testPlayers = 3;
      const testPlayerColor: PlayerColor = 'green';
      const defaultPlayerColors = NewGameConstants.getDefaultPlayerColors();

      jest.spyOn(NewGameConstants, 'getDefaultPlayers').mockImplementationOnce(() => testPlayers);
      jest.spyOn(NewGameConstants, 'getStartingStep').mockImplementationOnce(() => startingStep);

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        const playerColors = wrapper.find(PlayerColors);
        playerColors.props().onChange(testPlayerColor);
      });

      wrapper.update();

      const res = wrapper.find(PlayerColors).prop('playerColors');
      expect(res).toEqual([...defaultPlayerColors, testPlayerColor]);
    });

    it('should remove an existing player color', () => {
      const startingStep = 2;
      const testPlayers = 2;
      const defaultPlayerColors = NewGameConstants.getDefaultPlayerColors();
      const testPlayerColor: PlayerColor = defaultPlayerColors[0];
      const expectedPlayerColors = defaultPlayerColors.filter((_color, index) => index > 0);

      jest.spyOn(NewGameConstants, 'getDefaultPlayers').mockImplementationOnce(() => testPlayers);
      jest.spyOn(NewGameConstants, 'getStartingStep').mockImplementationOnce(() => startingStep);

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        const playerColors = wrapper.find(PlayerColors);
        playerColors.props().onChange(testPlayerColor);
      });

      wrapper.update();

      const res = wrapper.find(PlayerColors).prop('playerColors');
      expect(res).toEqual(expectedPlayerColors);
    });

    it('should not allow adding other colors when the maximum number of chosen players is already reached', () => {
      const startingStep = 2;
      const testPlayers = 2;
      const defaultPlayerColors = NewGameConstants.getDefaultPlayerColors();
      const testColor: PlayerColor = 'red';

      jest.spyOn(NewGameConstants, 'getDefaultPlayers').mockImplementationOnce(() => testPlayers);
      jest.spyOn(NewGameConstants, 'getStartingStep').mockImplementationOnce(() => startingStep);

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        const playerColors = wrapper.find(PlayerColors);
        playerColors.props().onChange(testColor);
      });

      wrapper.update();

      const res = wrapper.find(PlayerColors).prop('playerColors');
      expect(res).toEqual(defaultPlayerColors);
    });
  });
});
