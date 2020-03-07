import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { NewGameComponent } from './NewGameComponent';
import { GameTeams } from './GameTeams';
import { Stepper } from './Stepper';
import { GameName } from './GameName';
import { TeamColors } from './TeamColors';
import { TeamColor } from './NewGameTypes';
import { getDefaultTeams, getDefaultTeamColors } from './hooks/NewGameConstants';
import { useNewGame, UseNewGame } from './hooks/useNewGame';
import { GameReview } from './GameReview';
import { GameCreation } from './GameCreation';
import { GameRules } from './GameRules';

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
    const testError = null;

    shallow(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

    expect(true).toBeTruthy();
  });

  it('should render an error message', () => {
    const newGame = jest.fn();
    const testError = true;

    const wrapper = shallow(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

    expect(wrapper.hasClass('NewGame')).toBe(true);
    expect(wrapper.hasClass('error')).toBe(true);
  });

  describe('Stepper', () => {
    it('should render a Stepper component', () => {
      const testError = null;

      const wrapper = shallow(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);
      const stepper = wrapper.find(Stepper);

      expect(stepper.exists()).toBe(true);
    });

    it('should render a Stepper initialized to the first step', () => {
      const expectedActiveStep = 0;
      const testError = null;

      const wrapper = shallow(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

      const stepper = wrapper.find(Stepper);
      const activeStep = stepper.prop('activeStep');

      expect(activeStep).toBe(expectedActiveStep);
    });
  });

  describe('Navigation buttons', () => {
    it('should have a "previous" and a "next" step navigation buttons', () => {
      const testError = null;

      const wrapper = shallow(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

      const prevButton = wrapper.find('.prevStep');
      const nextButton = wrapper.find('.nextStep');

      expect(prevButton.exists()).toBe(true);
      expect(nextButton.exists()).toBe(true);
    });

    it('should have both the "previous" and the "next" step navigation buttons disabled on the first step', () => {
      const testError = null;

      const wrapper = mount(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

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
      const testError = null;

      const wrapper = mount(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

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
      const testError = null;

      const wrapper = mount(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

      act(() => {
        wrapper.find('button.prevStep').simulate('click');
      });

      expect(spyOnSetStep).toBeCalledWith(expectedStep);
    });
  });

  describe('GameName', () => {
    const activeStep = 0;

    it('should render a GameName content in the initial active step', () => {
      const testError = null;

      const wrapper = shallow(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

      const gameName = wrapper.find(GameName);
      const gameTeams = wrapper.find(GameTeams);
      const gameRules = wrapper.find(GameRules);

      expect(gameName.exists()).toBe(true);
      expect(gameTeams.exists()).not.toBe(true);
      expect(gameRules.exists()).not.toBe(true);
    });

    it('should update the reducer when updating the game name', () => {
      const mockOnGameNameChange = jest.fn();
      mockedUseNewGame.mockImplementationOnce(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        onGameNameChange: mockOnGameNameChange,
        activeStep,
      }));

      const testGameName = 'testGameName';
      const testError = null;

      const wrapper = mount(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

      act(() => {
        const gameName = wrapper.find(GameName);
        gameName.props().onChange(testGameName);
      });

      expect(mockOnGameNameChange).toBeCalledWith(testGameName);
    });

    it('should disable the "next" step navigation button when the game name is too short', () => {
      const testGameName = 'test';
      const testError = null;

      const wrapper = mount(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

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
      const testError = null;

      const wrapper = mount(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

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
        activeStep,
      }));
      const testError = null;

      const wrapper = mount(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

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

  describe('GameRules', () => {
    const activeStep = 1;

    it('should render the GameRules component as a second step', () => {
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
      }));
      const testError = null;

      const wrapper = shallow(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

      const gameRules = wrapper.find(GameRules);
      expect(gameRules.exists()).toBe(true);
    });
  });

  describe('GameTeams', () => {
    const activeStep = 2;

    it('should render the GameTeams component as a third step', () => {
      mockedUseNewGame.mockImplementationOnce(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
      }));
      const testError = null;

      const wrapper = mount(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);
      const gameTeams = wrapper.find(GameTeams);

      expect(gameTeams.exists()).toBe(true);
    });

    it('should update the reducer when updating the number of teams', () => {
      const testTeams = 11;
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
      }));
      const testError = null;

      const wrapper = mount(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

      act(() => {
        const gameTeams = wrapper.find(GameTeams);
        gameTeams.props().onChange(testTeams);
      });

      wrapper.update();

      const res = wrapper.find(GameTeams).prop('teams');
      expect(res).toBe(testTeams);
    });

    it('should not update the reducer when the updated number of teams is not changed', () => {
      const testTeams = getDefaultTeams();
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
      }));
      const testError = null;

      const wrapper = mount(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

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
    const activeStep = 3;

    it('should render the TeamColors component as a third step', () => {
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
      }));
      const testError = null;

      const wrapper = shallow(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

      const teamColors = wrapper.find(TeamColors);
      expect(teamColors.exists()).toBe(true);
    });

    it('should remove and add some team colors', () => {
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
      }));
      const testError = null;
      const expectedColorSize = 1;

      const wrapper = mount(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

      let teamColorsEl = wrapper.find(TeamColors);
      let currTeamColors = teamColorsEl.prop('teamColors');

      const testRemovedColor = currTeamColors[0];

      expect(currTeamColors.length).toBe(expectedColorSize);

      // Remove an existing color
      act(() => {
        teamColorsEl = wrapper.find(TeamColors);
        currTeamColors = teamColorsEl.prop('teamColors');
        teamColorsEl.props().onChange(testRemovedColor);
      });

      wrapper.update();

      teamColorsEl = wrapper.find(TeamColors);
      currTeamColors = teamColorsEl.prop('teamColors');
      expect(currTeamColors.length).toBe(expectedColorSize - 1);
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
      expect(currTeamColors.length).toBe(expectedColorSize);
      expect(Boolean(~currTeamColors.indexOf(testNewColor))).toBe(true);
    });

    it('should not allow adding other colors when the maximum number of chosen teams is already reached', () => {
      const defaultTeamColors = getDefaultTeamColors();
      const testColor: TeamColor = 'red';
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
      }));

      // Make sure the test color is not already selected
      expect(Boolean(~defaultTeamColors.indexOf(testColor))).toBe(false);
      const testError = null;

      const wrapper = shallow(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

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
    const activeStep = 4;

    it('should render the GameReview component as a final step', () => {
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
      }));
      const testError = null;

      const wrapper = shallow(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

      const gameReview = wrapper.find(GameReview);
      expect(gameReview.exists()).toBe(true);
    });

    it(`should display a "Let's go" button`, () => {
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
      }));
      const expectedButtonLabel = `Let's Go!`;
      const testError = null;

      const wrapper = shallow(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

      const nextButton = wrapper.find('.nextStep');
      const readyButton = wrapper.find('.ready');

      expect(nextButton.exists()).toBe(false);
      expect(readyButton.exists()).toBe(true);
      expect(readyButton.text()).toBe(expectedButtonLabel);
    });
  });

  describe('GameCreation', () => {
    const activeStep = 5;

    it('should render a GameCreation view while creating the board game', () => {
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
      }));
      const testError = null;

      const wrapper = mount(<NewGameComponent newGameLoading={true} onSubmit={newGame} newGameError={testError} />);

      const gameCreation = wrapper.find(GameCreation);
      expect(gameCreation.exists()).toBe(true);
    });

    it('should not display any navigation button', () => {
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
      }));
      const testError = null;

      const wrapper = shallow(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

      const prevButton = wrapper.find('.prevStep');
      const nextButton = wrapper.find('.nextStep');
      const readyButton = wrapper.find('.ready');

      expect(prevButton.exists()).toBe(false);
      expect(nextButton.exists()).toBe(false);
      expect(readyButton.exists()).toBe(false);
    });
  });

  describe('handleActiveStep', () => {
    const activeStep = 0;

    it('should disable the next step button when the current one is invalid', () => {
      const mockCheckStep = jest.fn();
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
        checkStep: mockCheckStep,
      }));
      const testError = null;

      const wrapper = mount(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

      const nextButton = wrapper.find('button.nextStep');
      expect(nextButton.prop('disabled')).toBe(true);
    });

    it('should not allow going to the next step when the current one is invalid', () => {
      const mockCheckStep = jest.fn();
      const mockOnSetStep = jest.fn();
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
        checkStep: mockCheckStep,
        onSetStep: mockOnSetStep,
      }));
      const testError = null;

      const wrapper = mount(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

      act(() => {
        const stepper = wrapper.find(Stepper);
        stepper.prop('onStepClick')(activeStep + 1)({} as any);
      });
      wrapper.update();

      expect(mockOnSetStep).not.toBeCalled();
    });

    it('should allow going to the next step when the current one is valid', () => {
      const mockCheckStep = jest.fn(() => true);
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
        checkStep: mockCheckStep,
      }));
      const testError = null;

      const wrapper = mount(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

      const nextButton = wrapper.find('button.nextStep');
      expect(nextButton.prop('disabled')).toBe(false);
    });

    it('should update the view when going to the next step', () => {
      const mockOnSetStep = jest.fn();
      const mockCheckStep = jest.fn(() => true);
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
        checkStep: mockCheckStep,
        onSetStep: mockOnSetStep,
      }));
      const testError = null;

      const wrapper = mount(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);

      const nextButton = wrapper.find('button.nextStep');
      act(() => {
        nextButton.simulate('click');
      });
      wrapper.update();

      expect(nextButton.prop('disabled')).toBe(false);
      expect(mockOnSetStep).toBeCalledWith(activeStep + 1);
    });

    it('should not allow jumping to a not completed step', () => {
      const mockOnSetStep = jest.fn();
      const mockCheckStep = jest.fn(() => true);
      const mockCompletedSteps = [0];
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
        checkStep: mockCheckStep,
        onSetStep: mockOnSetStep,
        completedSteps: mockCompletedSteps,
      }));
      const testError = null;

      const wrapper = shallow(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);
      const stepper = wrapper.find(Stepper);

      act(() => {
        stepper.prop('onStepClick')(activeStep + 2)({} as any);
      });
      wrapper.update();

      expect(mockOnSetStep).not.toBeCalled();
    });

    it('should allow jumping to a completed step', () => {
      const mockOnSetStep = jest.fn();
      const mockCheckStep = jest.fn(() => true);
      const mockCompletedSteps = [0, 1, 2];
      mockedUseNewGame.mockImplementation(() => ({
        ...jest.requireActual('./hooks/useNewGame').useNewGame(),
        activeStep,
        checkStep: mockCheckStep,
        onSetStep: mockOnSetStep,
        completedSteps: mockCompletedSteps,
      }));
      const testError = null;

      const wrapper = shallow(<NewGameComponent newGameLoading={false} onSubmit={newGame} newGameError={testError} />);
      const stepper = wrapper.find(Stepper);

      act(() => {
        stepper.prop('onStepClick')(activeStep + 2)({} as any);
      });
      wrapper.update();

      expect(mockOnSetStep).toBeCalledWith(activeStep + 2);
    });
  });
});
