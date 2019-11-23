import { newGameReducer, NewGameState } from './NewGameReducer';
import {
  NewGameActionType,
  TEAMS,
  COLORS,
  RULES,
  RulesPayload,
  PREDEFINED_RULES,
  COMPLETE_STEP,
  SUBMIT,
  SETUP,
} from './NewGameActionTypes';
import { GameListItem, TeamColor } from '../NewGameTypes';

describe('NewGameReducer', () => {
  const initialState: NewGameState = {
    setup: {
      gameName: 'testGameName',
    },
    teams: 2,
    teamColors: ['red', 'green'],
    rules: {
      isMatchesBased: false,
      maxTeamSize: 2,
      minTeamSize: 2,
      name: 'testName',
      scoringSystem: 'increase',
      startingScore: 0,
      winningScore: 0,
      winningScoreEnabled: false,
    },
    steps: {
      active: 0,
      completed: [],
    },
    gameSubmitted: false,
    error: false,
  };

  it('should work without crashing', () => {
    const action: any = {};
    newGameReducer(initialState, action);

    expect(true).toBe(true);
  });

  it('should return the initial state', () => {
    const action: any = {};
    const reducer = newGameReducer(initialState, action);

    expect(reducer).toEqual(initialState);
  });

  it('should handle SETUP', () => {
    const testGameName = 'testGameName';

    const testAction: NewGameActionType = {
      type: SETUP,
      payload: testGameName,
    };

    const reducer = newGameReducer(initialState, testAction);

    expect(reducer.setup.gameName).toBe(testGameName);
  });

  describe('TEAMS', () => {
    it('should update the team size', () => {
      const testTeams = 2;

      const testAction: NewGameActionType = {
        type: TEAMS,
        payload: {
          teams: testTeams,
          teamColors: [],
        },
      };

      const reducer = newGameReducer(initialState, testAction);

      expect(reducer.teams).toBe(testTeams);
    });

    it('should update the team colors', () => {
      const testTeamColors: TeamColor[] = ['yellow', 'red'];

      const testAction: NewGameActionType = {
        type: TEAMS,
        payload: {
          teams: 1,
          teamColors: testTeamColors,
        },
      };

      const reducer = newGameReducer(initialState, testAction);

      expect(reducer.teamColors).toBe(testTeamColors);
    });

    it('should override both "teams" and "teamColors"', () => {
      const testAction: NewGameActionType = {
        type: TEAMS,
        payload: {} as any,
      };

      const reducer = newGameReducer(initialState, testAction);

      expect(reducer.teams).toBeUndefined();
      expect(reducer.teamColors).toBeUndefined();
    });
  });

  it('should handle COLORS', () => {
    const testTeamColors: TeamColor[] = ['yellow', 'red'];

    const testAction: NewGameActionType = {
      type: COLORS,
      payload: testTeamColors,
    };

    const reducer = newGameReducer(initialState, testAction);

    expect(reducer.teamColors).toBe(testTeamColors);
  });

  describe('RULES', () => {
    it('should reset any existing rule name to an empty string when user alters the game rules', () => {
      const expectedRuleName = '';

      expect(initialState.rules.name).not.toBe(expectedRuleName);

      const testAction: NewGameActionType = {
        type: RULES,
        payload: {
          name: 'customRuleName',
        } as any,
      };

      const reducer = newGameReducer(initialState, testAction);

      expect(reducer.rules.name).toBe(expectedRuleName);
    });

    it('should preserve the previous rules and only update the new changes', () => {
      const testMaxTeamSize = initialState.rules.maxTeamSize + 1;
      const testMinTeamSize = initialState.rules.minTeamSize + 1;
      const testScoringSystem = 'both';

      const testCustomRules: any = {
        maxTeamSize: testMaxTeamSize,
        minTeamSize: testMinTeamSize,
        scoringSystem: testScoringSystem,
      };

      const expectedRules: GameListItem = {
        name: '',
        maxTeamSize: testMaxTeamSize,
        minTeamSize: testMinTeamSize,
        scoringSystem: testScoringSystem,
        isMatchesBased: initialState.rules.isMatchesBased,
        startingScore: initialState.rules.startingScore,
        winningScore: initialState.rules.winningScore,
        winningScoreEnabled: initialState.rules.winningScoreEnabled,
      };

      expect(initialState.rules.maxTeamSize).not.toBe(testMaxTeamSize);
      expect(initialState.rules.minTeamSize).not.toBe(testMinTeamSize);
      expect(initialState.rules.scoringSystem).not.toBe(testScoringSystem);

      const testAction: NewGameActionType = {
        type: RULES,
        payload: testCustomRules,
      };

      const reducer = newGameReducer(initialState, testAction);

      expect(reducer.rules).toEqual(expectedRules);
    });

    it('should update the team size', () => {
      const testTeams = 5;

      expect(initialState.teams).not.toBe(testTeams);

      const testAction: NewGameActionType = {
        type: RULES,
        payload: {
          teams: testTeams,
        } as RulesPayload,
      };

      const reducer = newGameReducer(initialState, testAction);

      expect(reducer.teams).toEqual(testTeams);
    });
  });

  describe('PREDEFINED_RULES', () => {
    it('should return the previous state when a payload is not provided', () => {
      const testAction: NewGameActionType = {
        type: PREDEFINED_RULES,
        payload: '' as any,
      };

      const reducer = newGameReducer(initialState, testAction);

      expect(reducer.teams).toBe(initialState.teams);
      expect(reducer.rules).toEqual(initialState.rules);
    });

    it('should update the team size', () => {
      const testTeams = 12;

      const testAction: any = {
        type: 'PREDEFINED_RULES',
        payload: {
          teams: testTeams,
        },
      };

      const reducer = newGameReducer(initialState, testAction);

      expect(reducer.teams).toBe(testTeams);
    });

    it('should always update the team size and result to undefined when not provided', () => {
      const testAction: any = {
        type: PREDEFINED_RULES,
        payload: {},
      };

      const reducer = newGameReducer(initialState, testAction);

      expect(reducer.teams).toBeUndefined();
    });

    it('should always update the game rules and result to an empty object when not provided', () => {
      const testPayload = {};
      const testAction: NewGameActionType = {
        type: PREDEFINED_RULES,
        payload: testPayload as RulesPayload,
      };

      const reducer = newGameReducer(initialState, testAction);

      expect(reducer.rules).toEqual(testPayload);
    });

    it('should update all the game rules according to the predefined rules provided', () => {
      const testTeams = 5;
      const testRules: GameListItem = {
        isMatchesBased: false,
        maxTeamSize: 12,
        minTeamSize: 1,
        name: 'Test Rules',
        scoringSystem: 'decrease',
        startingScore: 100,
        winningScore: 0,
        winningScoreEnabled: true,
      };

      const testAction: NewGameActionType = {
        type: PREDEFINED_RULES,
        payload: { ...testRules, teams: testTeams },
      };

      const reducer = newGameReducer(initialState, testAction);

      expect(reducer.rules).toEqual(testRules);
      expect(reducer.teams).toEqual(testTeams);
    });
  });

  describe('COMPLETE_STEP', () => {
    it('should update the active step', () => {
      const testPayload = {
        activeStep: 12,
        completedSteps: [],
      };

      const testAction: NewGameActionType = {
        type: COMPLETE_STEP,
        payload: testPayload,
      };

      const reducer = newGameReducer(initialState, testAction);

      expect(reducer.steps.active).toBe(testPayload.activeStep);
    });

    it('should update the completed step', () => {
      const testPayload = {
        activeStep: 0,
        completedSteps: [10, 11],
      };

      const testAction: NewGameActionType = {
        type: COMPLETE_STEP,
        payload: testPayload,
      };

      const reducer = newGameReducer(initialState, testAction);

      expect(reducer.steps.completed).toEqual(testPayload.completedSteps);
    });
  });

  describe('SUBMIT', () => {
    it('should increment the active step', () => {
      const currentActiveStep = initialState.steps.active;
      const expectedActiveStep = currentActiveStep + 1;

      const testAction: NewGameActionType = {
        type: SUBMIT,
      };

      const reducer = newGameReducer(initialState, testAction);

      expect(reducer.steps.active).toBe(expectedActiveStep);
    });

    it('should set "gameSubmitted" to "true"', () => {
      const currentGameSubmitted = initialState.gameSubmitted;
      const expectedGameSubmitted = !currentGameSubmitted;

      const testAction: NewGameActionType = {
        type: SUBMIT,
      };

      const reducer = newGameReducer(initialState, testAction);

      expect(reducer.gameSubmitted).toBe(expectedGameSubmitted);
    });

    it('should set "gameSubmitted" to "true"', () => {
      const currentGameSubmitted = initialState.gameSubmitted;
      const expectedGameSubmitted = !currentGameSubmitted;

      const testAction: NewGameActionType = {
        type: SUBMIT,
      };

      const reducer = newGameReducer(initialState, testAction);

      expect(reducer.gameSubmitted).toBe(expectedGameSubmitted);
    });
  });
});
