import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { NewGameComponent } from './NewGameComponent';
import { GamePlayers } from './GamePlayers';
import { Stepper } from './Stepper';
import { GameName } from './GameName';

describe('NewGameComponent', () => {
  it('should render without crashing', () => {
    const newGame = jest.fn();

    shallow(<NewGameComponent newGameLoading={false} newGame={newGame} />);

    expect(true).toBeTruthy();
  });

  describe('handlePlayersChange', () => {
    const newGame = jest.fn();

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

    it('should render a GameName content in the initial active step', () => {
      const wrapper = shallow(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      const gameName = wrapper.find(GameName);
      const gamePlayers = wrapper.find(GamePlayers);

      expect(gameName.exists()).toBe(true);
      expect(gamePlayers.exists()).not.toBe(true);
    });

    it('should have a "previous" and a "next" step navigation buttons', () => {
      const wrapper = shallow(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      const prevButton = wrapper.find('.prevStep');
      const nextButton = wrapper.find('.nextStep');

      expect(prevButton.exists()).toBe(true);
      expect(nextButton.exists()).toBe(true);
    });

    it('should have a "previous" step navigation button disabled and the "next" one enabled on the first step', () => {
      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      const prevButton = wrapper.find('.prevStep');
      const nextButton = wrapper.find('.nextStep');

      expect(prevButton.find('button').prop('disabled')).toBe(true);
      expect(nextButton.find('button').prop('disabled')).toBe(false);
    });

    it('should have both the "previous" and the "next" step navigation buttons enabled on the second step', () => {
      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        wrapper
          .find('.nextStep')
          .find('button')
          .simulate('click');
      });

      wrapper.update();

      const prevButton = wrapper.find('.prevStep');
      const nextButton = wrapper.find('.nextStep');

      expect(prevButton.find('button').prop('disabled')).toBe(false);
      expect(nextButton.find('button').prop('disabled')).toBe(false);
    });

    it('should render the GamePlayers component as a second step', () => {
      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        wrapper
          .find('.nextStep')
          .find('button')
          .simulate('click');
      });

      wrapper.update();

      const gameName = wrapper.find(GameName);
      const gamePlayers = wrapper.find(GamePlayers);

      expect(gamePlayers.exists()).toBe(true);
      expect(gameName.exists()).not.toBe(true);
    });
  });
});
