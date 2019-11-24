import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { Component as NewGameComponent } from './NewGameComponent';
import { GameTeams } from './GameTeams';
import { Stepper } from './Stepper';
import { GameName } from './GameName';
import { TeamColors } from './TeamColors';
import { TeamColor } from './NewGameTypes';
import { getDefaultTeams, getDefaultTeamColors } from './hooks/NewGameConstants';
import { useNewGame, UseNewGame } from './hooks/useNewGame';
import { GameReview } from './GameReview';
import { GameCreation } from './GameCreation';

jest.mock('./hooks/useNewGame');

describe('NewGameComponent', () => {
  const newGame = jest.fn();
  const mockedUseNewGame = useNewGame as jest.Mock<UseNewGame>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseNewGame.mockImplementation(() => jest.requireActual('./hooks/useNewGame').useNewGame());
  });

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
      const activeStep = 1;

      mockedUseNewGame.mockImplementationOnce(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
      }));

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      const prevButton = wrapper.find('.prevStep');
      expect(prevButton.find('button').prop('disabled')).toBe(false);
    });

    it('should allow going back from the step 2 to 1', () => {
      const activeStep = 1;
      const expectedStep = 0;
      const spyOnSetStep = jest.fn();

      mockedUseNewGame.mockImplementationOnce(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
        onSetStep: spyOnSetStep,
      }));

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        wrapper.find('button.prevStep').simulate('click');
      });

      expect(spyOnSetStep).toBeCalledWith(expectedStep);
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
      const mockOnGameNameChange = jest.fn();
      mockedUseNewGame.mockImplementationOnce(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        onGameNameChange: mockOnGameNameChange,
        activeStep: 0,
      }));

      const testGameName = 'testGameName';
      const wrapper = shallow(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        const gameName = wrapper.find(GameName);
        gameName.props().onChange(testGameName);
      });

      expect(mockOnGameNameChange).toBeCalledWith(testGameName);
    });

    it('should disable the "next" step navigation button when the game name is too short', () => {
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
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep: 0,
      }));

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
      const activeStep = 2;
      mockedUseNewGame.mockImplementationOnce(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
      }));

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      act(() => {
        const goToStep = wrapper.find(Stepper).props().onStepClick;
        goToStep(activeStep)({} as any);
      });

      wrapper.update();

      const gameName = wrapper.find(GameName);
      const gameTeams = wrapper.find(GameTeams);

      expect(gameTeams.exists()).toBe(true);
      expect(gameName.exists()).not.toBe(true);
    });

    it('should update the reducer when updating the number of teams', () => {
      const activeStep = 2;
      const testTeams = 11;
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
      }));

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
      const activeStep = 2;
      const testTeams = getDefaultTeams();
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
      }));

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
      const activeStep = 3;
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
      }));

      const wrapper = shallow(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      const teamColors = wrapper.find(TeamColors);
      expect(teamColors.exists()).toBe(true);
    });

    it('should change a team color', () => {
      const activeStep = 3;
      const testTeamSize = getDefaultTeams();
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
      }));

      const wrapper = mount(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      let teamColorsEl = wrapper.find(TeamColors);
      let currTeamColors = teamColorsEl.prop('teamColors');
      const testRemovedColor = currTeamColors[0];

      expect(currTeamColors.length).toBe(testTeamSize);

      // Remove an existing color
      act(() => {
        teamColorsEl = wrapper.find(TeamColors);
        currTeamColors = teamColorsEl.prop('teamColors');
        teamColorsEl.props().onChange(testRemovedColor);
      });

      wrapper.update();

      teamColorsEl = wrapper.find(TeamColors);
      currTeamColors = teamColorsEl.prop('teamColors');
      expect(currTeamColors.length).toBe(testTeamSize - 1);
      expect(Boolean(~currTeamColors.indexOf(testRemovedColor))).toBe(false);

      const testNewColor: TeamColor = 'aquamarine';

      // Add a new color
      act(() => {
        teamColorsEl = wrapper.find(TeamColors);
        currTeamColors = teamColorsEl.prop('teamColors');
        teamColorsEl.props().onChange(testNewColor);
      });

      wrapper.update();

      teamColorsEl = wrapper.find(TeamColors);
      currTeamColors = teamColorsEl.prop('teamColors');
      expect(currTeamColors.length).toBe(testTeamSize);
      expect(Boolean(~currTeamColors.indexOf(testNewColor))).toBe(true);
    });

    it('should not allow adding other colors when the maximum number of chosen teams is already reached', () => {
      const activeStep = 3;
      const defaultTeamColors = getDefaultTeamColors();
      const testColor: TeamColor = 'red';
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
      }));

      // Make sure the test color is not already selected
      expect(Boolean(~defaultTeamColors.indexOf(testColor))).toBe(false);

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

  describe('GameReview', () => {
    it('should render the GameReview component as a final step', () => {
      const activeStep = 4;
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
      }));

      const wrapper = shallow(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      const teamColors = wrapper.find(GameReview);
      expect(teamColors.exists()).toBe(true);
    });

    it(`should display a "Let's go" button`, () => {
      const activeStep = 4;
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
      }));
      const expectedButtonLabel = `Let's Go!`;
      const wrapper = shallow(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      const nextButton = wrapper.find('.nextStep');
      const readyButton = wrapper.find('.ready');

      expect(nextButton.exists()).toBe(false);
      expect(readyButton.exists()).toBe(true);
      expect(readyButton.text()).toBe(expectedButtonLabel);
    });
  });

  describe('GameCreation', () => {
    it('should render a GameCreation view while creating the board game', () => {
      const activeStep = 5;
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
      }));

      const wrapper = shallow(<NewGameComponent newGameLoading={false} newGame={newGame} />);

      const teamColors = wrapper.find(GameCreation);
      expect(teamColors.exists()).toBe(true);
    });
  });
});
