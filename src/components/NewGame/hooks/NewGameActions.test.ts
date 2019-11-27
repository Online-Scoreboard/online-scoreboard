import {
  setupAction,
  teamsAction,
  colorsAction,
  customRulesAction,
  predefinedRulesAction,
  completeStepAction,
} from './NewGameActions';
import {
  NewGameActionType,
  SETUP,
  TEAMS,
  COLORS,
  RULES,
  PREDEFINED_RULES,
  COMPLETE_STEP,
  SUBMIT,
} from './NewGameActionTypes';
import { TeamColor, GameListItem } from '../NewGameTypes';

describe('NewGameActions', () => {
  describe('setupAction', () => {
    it('should return the correct type and payload', () => {
      const testValue = 'testValue';
      const expectedResult: NewGameActionType = {
        type: SETUP,
        payload: testValue,
      };

      const res = setupAction(testValue);

      expect(res).toEqual(expectedResult);
    });
  });

  describe('teamsAction', () => {
    it('should return the correct type and payload', () => {
      const testColorList: TeamColor[] = ['black', 'blue'];
      const testTeamColors: TeamColor[] = ['black', 'blue'];
      const testNewTeams = testTeamColors.length;

      const res: any = teamsAction(testColorList, testTeamColors, testNewTeams);

      expect(res.type).toEqual(TEAMS);
      expect(res).toHaveProperty('payload');
      expect(res.payload).toHaveProperty('teams');
      expect(res.payload).toHaveProperty('teamColors');
    });

    it('should return the provided "newTeams" and "teamColors" when the new team size has not changed', () => {
      const testColorList: TeamColor[] = ['black', 'blue'];
      const testTeamColors: TeamColor[] = ['black', 'blue'];
      const testNewTeams = testTeamColors.length;

      const testValue = {
        teams: testNewTeams,
        teamColors: testTeamColors,
      };

      const expectedResult: NewGameActionType = {
        type: TEAMS,
        payload: testValue,
      };

      const res = teamsAction(testColorList, testTeamColors, testNewTeams);

      expect(res).toEqual(expectedResult);
    });

    it('should remove a team color when the provided "newTeams" is smaller than the existing team colors selected', () => {
      const testColorList: TeamColor[] = ['black', 'blue'];
      const testTeamColors: TeamColor[] = ['black', 'blue'];
      const testNewTeams = testTeamColors.length - 1;
      const expectedTeamColors = testTeamColors.slice(0, testNewTeams);

      const testValue = {
        teams: testNewTeams,
        teamColors: expectedTeamColors,
      };

      const expectedResult: NewGameActionType = {
        type: TEAMS,
        payload: testValue,
      };

      const res = teamsAction(testColorList, testTeamColors, testNewTeams);

      expect(res).toEqual(expectedResult);
    });

    it('should add a new team color when the provided "newTeams" is bigger than the existing team colors selected', () => {
      const testColorList: TeamColor[] = ['black', 'blue', 'red'];
      const testTeamColors: TeamColor[] = ['black', 'blue'];
      const testNewTeams = testTeamColors.length + 1;
      const expectedTeamColors = [...testTeamColors, testColorList[testNewTeams - 1]];

      const testValue = {
        teams: testNewTeams,
        teamColors: expectedTeamColors,
      };

      const expectedResult: NewGameActionType = {
        type: TEAMS,
        payload: testValue,
      };

      const res = teamsAction(testColorList, testTeamColors, testNewTeams);

      expect(res).toEqual(expectedResult);
    });

    it('should not add any new team color when the provided "newTeams" is bigger than the existing team colors selected but there are no colors available', () => {
      const testColorList: TeamColor[] = ['black', 'blue'];
      const testTeamColors: TeamColor[] = ['black', 'blue'];
      const testNewTeams = testTeamColors.length + 1;
      const expectedTeamColors = [...testTeamColors];

      const testValue = {
        teams: testNewTeams,
        teamColors: expectedTeamColors,
      };

      const expectedResult: NewGameActionType = {
        type: TEAMS,
        payload: testValue,
      };

      const res = teamsAction(testColorList, testTeamColors, testNewTeams);

      expect(res).toEqual(expectedResult);
    });
  });

  describe('colorsAction', () => {
    it('should return the correct type and payload', () => {
      const testTeams = 2;
      const testTeamColor: TeamColor = 'black';
      const testTeamColors: TeamColor[] = ['black', 'blue'];

      const res = colorsAction(testTeamColor, testTeamColors, testTeams);

      const isArray = Array.isArray((res as any).payload);

      expect(res.type).toEqual(COLORS);
      expect(res).toHaveProperty('payload');
      expect(isArray).toBe(true);
    });

    it('should add the new color to the payload when not already present in the existing team colors', () => {
      const testTeams = 3;
      const testTeamColor: TeamColor = 'red';
      const testTeamColors: TeamColor[] = ['black', 'blue'];
      const expectedResult: NewGameActionType = {
        type: COLORS,
        payload: [...testTeamColors, testTeamColor],
      };

      const res = colorsAction(testTeamColor, testTeamColors, testTeams);

      expect(res).toEqual(expectedResult);
    });

    it('should not add any new color when each available team has already a color assigned', () => {
      const testTeamColor: TeamColor = 'red';
      const testTeamColors: TeamColor[] = ['black', 'blue'];
      const testTeams = testTeamColors.length;

      const expectedResult: NewGameActionType = {
        type: COLORS,
        payload: testTeamColors,
      };

      const res = colorsAction(testTeamColor, testTeamColors, testTeams);

      expect(res).toEqual(expectedResult);
    });

    it('should remove an existing color when already present in the Team Colors', () => {
      const testTeamColor: TeamColor = 'white';
      const testTeamColors: TeamColor[] = ['black', 'white'];
      const testTeams = 2;

      const expectedResult: NewGameActionType = {
        type: COLORS,
        payload: [testTeamColors[0]],
      };

      const res = colorsAction(testTeamColor, testTeamColors, testTeams);

      expect(res).toEqual(expectedResult);
    });
  });

  describe('predefinedRulesAction', () => {
    it('should return the correct type and payload', () => {
      const testNewRules: GameListItem = {
        name: 'test',
        isMatchesBased: false,
        maxTeamSize: 4,
        minTeamSize: 2,
        scoringSystem: 'increase',
        startingScore: 0,
        winningScore: 0,
        winningScoreEnabled: false,
      };
      const testTeams = 2;

      const res = predefinedRulesAction(testNewRules, testTeams);

      expect(res.type).toEqual(PREDEFINED_RULES);
      expect(res).toHaveProperty('payload');
      expect((res as any).payload).toHaveProperty('teams');
      expect((res as any).payload).toHaveProperty('name');
    });

    it('should update the number of teams when smaller than the minimum team size', () => {
      const testNewRules: GameListItem = {
        name: 'test',
        isMatchesBased: false,
        maxTeamSize: 4,
        minTeamSize: 2,
        scoringSystem: 'increase',
        startingScore: 0,
        winningScore: 0,
        winningScoreEnabled: false,
      };
      const testTeams = 1;

      const expectedResult: NewGameActionType = {
        type: PREDEFINED_RULES,
        payload: {
          ...testNewRules,
          teams: testNewRules.minTeamSize,
        },
      };

      const res = predefinedRulesAction(testNewRules, testTeams);

      expect(res).toEqual(expectedResult);
    });

    it('should update the number of teams when bigger than the maximum team size', () => {
      const testNewRules: GameListItem = {
        name: 'test',
        isMatchesBased: false,
        maxTeamSize: 4,
        minTeamSize: 2,
        scoringSystem: 'increase',
        startingScore: 0,
        winningScore: 0,
        winningScoreEnabled: false,
      };
      const testTeams = 5;

      const expectedResult: NewGameActionType = {
        type: PREDEFINED_RULES,
        payload: {
          ...testNewRules,
          teams: testNewRules.maxTeamSize,
        },
      };

      const res = predefinedRulesAction(testNewRules, testTeams);

      expect(res).toEqual(expectedResult);
    });
  });

  describe('customRulesAction', () => {
    it('should return the correct type and payload', () => {
      const testNewRules: Partial<GameListItem> = {
        name: 'test',
      };
      const testRules: any = {};
      const testTeams = 2;

      const res = customRulesAction(testNewRules, testRules, testTeams);

      expect(res.type).toEqual(RULES);
      expect(res).toHaveProperty('payload');
      expect((res as any).payload).toHaveProperty('teams');
      expect((res as any).payload).toHaveProperty('name');
    });

    it('should force the scoring system to "decrease" when the winning condition is enabled, the scoring system is set to "increase" and the winning score is minor than the starting one', () => {
      const testNewRules: Partial<GameListItem> = {
        winningScoreEnabled: true,
        scoringSystem: 'increase',
        winningScore: 0,
        startingScore: 10,
        maxTeamSize: 2,
        minTeamSize: 2,
      };
      const testRules: any = {};
      const testTeams = 2;

      const expectedScoringSystem = 'decrease';

      const expectedResult: NewGameActionType = {
        type: RULES,
        payload: {
          ...testRules,
          ...testNewRules,
          scoringSystem: expectedScoringSystem,
          teams: testTeams,
        },
      };

      const res = customRulesAction(testNewRules, testRules, testTeams);

      expect(res).toEqual(expectedResult);
    });

    it('should force the scoring system to "increase" when the winning condition is enabled, the scoring system is set to "decrease" and the winning score is bigger than the starting one', () => {
      const testNewRules: Partial<GameListItem> = {
        winningScoreEnabled: true,
        scoringSystem: 'decrease',
        winningScore: 10,
        startingScore: 0,
        maxTeamSize: 2,
        minTeamSize: 2,
      };
      const testRules: any = {};
      const testTeams = 2;

      const expectedScoringSystem = 'increase';

      const expectedResult: NewGameActionType = {
        type: RULES,
        payload: {
          ...testRules,
          ...testNewRules,
          scoringSystem: expectedScoringSystem,
          teams: testTeams,
        },
      };

      const res = customRulesAction(testNewRules, testRules, testTeams);

      expect(res).toEqual(expectedResult);
    });

    it('should force the starting score to "0" when the game is in match mode', () => {
      const testNewRules: Partial<GameListItem> = {
        winningScoreEnabled: true,
        scoringSystem: 'increase',
        winningScore: 10,
        startingScore: 10,
        isMatchesBased: true,
        maxTeamSize: 2,
        minTeamSize: 2,
      };
      const testRules: any = {};
      const testTeams = 2;

      const expectedStartingScore = 0;

      const expectedResult: NewGameActionType = {
        type: RULES,
        payload: {
          ...testRules,
          ...testNewRules,
          startingScore: expectedStartingScore,
          teams: testTeams,
        },
      };

      const res = customRulesAction(testNewRules, testRules, testTeams);

      expect(res).toEqual(expectedResult);
    });

    it('should force the scoring system to increase when the game is in match mode', () => {
      const testNewRules: Partial<GameListItem> = {
        winningScoreEnabled: true,
        scoringSystem: 'decrease',
        winningScore: 10,
        startingScore: 0,
        isMatchesBased: true,
        maxTeamSize: 2,
        minTeamSize: 2,
      };
      const testRules: any = {};
      const testTeams = 2;

      const expectedScoringSystem = 'increase';

      const expectedResult: NewGameActionType = {
        type: RULES,
        payload: {
          ...testRules,
          ...testNewRules,
          scoringSystem: expectedScoringSystem,
          teams: testTeams,
        },
      };

      const res = customRulesAction(testNewRules, testRules, testTeams);

      expect(res).toEqual(expectedResult);
    });

    it('should force the winning score to be 1 when set to 0 or less and in match mode and winning condition enabled', () => {
      const testNewRules: GameListItem = {
        winningScoreEnabled: true,
        scoringSystem: 'increase',
        winningScore: 0,
        startingScore: 0,
        isMatchesBased: true,
        maxTeamSize: 2,
        minTeamSize: 2,
        name: '',
      };
      const testRules: any = {};
      const testTeams = 2;

      const expectedResult: NewGameActionType = {
        type: RULES,
        payload: {
          ...testNewRules,
          teams: testTeams,
          winningScore: 1,
        },
      };

      const res = customRulesAction(testNewRules, testRules, testTeams);

      expect(res).toEqual(expectedResult);
    });

    it('should force the minimum team size to be 1 when set to 0 or less', () => {
      const testNewRules: GameListItem = {
        winningScoreEnabled: false,
        scoringSystem: 'increase',
        winningScore: 0,
        startingScore: 0,
        isMatchesBased: true,
        maxTeamSize: 2,
        minTeamSize: 0,
        name: '',
      };
      const testRules: any = {};
      const testTeams = 2;

      const expectedResult: NewGameActionType = {
        type: RULES,
        payload: {
          ...testNewRules,
          teams: testTeams,
          minTeamSize: 1,
        },
      };

      const res = customRulesAction(testNewRules, testRules, testTeams);

      expect(res).toEqual(expectedResult);
    });

    it('should force the minimum and maximum team size to be 12 when the minimum is set to 13 or more', () => {
      const testNewRules: GameListItem = {
        winningScoreEnabled: false,
        scoringSystem: 'increase',
        winningScore: 0,
        startingScore: 0,
        isMatchesBased: true,
        maxTeamSize: 1,
        minTeamSize: 13,
        name: '',
      };
      const testRules: any = {};
      const testTeams = 12;

      const expectedResult: NewGameActionType = {
        type: RULES,
        payload: {
          ...testNewRules,
          teams: testTeams,
          minTeamSize: 12,
          maxTeamSize: 12,
        },
      };

      const res = customRulesAction(testNewRules, testRules, testTeams);

      expect(res).toEqual(expectedResult);
    });

    it('should force the maximum team size to match the minimum when the minimum is set to 13 or more', () => {
      const testNewRules: GameListItem = {
        winningScoreEnabled: false,
        scoringSystem: 'increase',
        winningScore: 0,
        startingScore: 0,
        isMatchesBased: true,
        maxTeamSize: 1,
        minTeamSize: 13,
        name: '',
      };
      const testRules: any = {};
      const testTeams = 12;

      const expectedResult: NewGameActionType = {
        type: RULES,
        payload: {
          ...testNewRules,
          teams: testTeams,
          minTeamSize: 12,
          maxTeamSize: 12,
        },
      };

      const res = customRulesAction(testNewRules, testRules, testTeams);

      expect(res).toEqual(expectedResult);
    });

    it('should force the maximum team size to match the minimum when minor than that', () => {
      const testNewRules: GameListItem = {
        winningScoreEnabled: false,
        scoringSystem: 'increase',
        winningScore: 0,
        startingScore: 0,
        isMatchesBased: true,
        maxTeamSize: 8,
        minTeamSize: 12,
        name: '',
      };
      const testRules: any = {};
      const testTeams = 12;

      const expectedResult: NewGameActionType = {
        type: RULES,
        payload: {
          ...testNewRules,
          teams: testTeams,
          minTeamSize: 12,
          maxTeamSize: 12,
        },
      };

      const res = customRulesAction(testNewRules, testRules, testTeams);

      expect(res).toEqual(expectedResult);
    });

    it.each`
      maxTeamSize | expectedMaxTeamSize
      ${0}        | ${1}
      ${1}        | ${1}
      ${2}        | ${2}
      ${-1}       | ${1}
      ${-100}     | ${1}
    `('should force the maximum team size to be 1 when set to $maxTeamSize', ({ maxTeamSize, expectedMaxTeamSize }) => {
      const testNewRules: GameListItem = {
        winningScoreEnabled: false,
        scoringSystem: 'increase',
        winningScore: 0,
        startingScore: 0,
        isMatchesBased: true,
        maxTeamSize,
        minTeamSize: 1,
        name: '',
      };
      const testRules: any = {};
      const testTeams = 1;

      const expectedResult: NewGameActionType = {
        type: RULES,
        payload: {
          ...testNewRules,
          teams: testTeams,
          maxTeamSize: expectedMaxTeamSize,
        },
      };

      const res = customRulesAction(testNewRules, testRules, testTeams);

      expect(res).toEqual(expectedResult);
    });

    it.each`
      maxTeamSize | expectedMaxTeamSize
      ${12}       | ${12}
      ${13}       | ${12}
      ${15}       | ${12}
      ${100}      | ${12}
      ${999}      | ${12}
    `(
      'should force the maximum team size to be 12 when set to $maxTeamSize',
      ({ maxTeamSize, expectedMaxTeamSize }) => {
        const testNewRules: GameListItem = {
          winningScoreEnabled: false,
          scoringSystem: 'increase',
          winningScore: 0,
          startingScore: 0,
          isMatchesBased: true,
          maxTeamSize,
          minTeamSize: 1,
          name: '',
        };
        const testRules: any = {};
        const testTeams = 1;

        const expectedResult: NewGameActionType = {
          type: RULES,
          payload: {
            ...testNewRules,
            teams: testTeams,
            maxTeamSize: expectedMaxTeamSize,
          },
        };

        const res = customRulesAction(testNewRules, testRules, testTeams);

        expect(res).toEqual(expectedResult);
      }
    );
  });

  describe('completeStepAction', () => {
    it('should return the correct type and payload', () => {
      const testStepList = ['first', 'second', 'third'];
      const testActiveStep = 0;
      const testIsValid = true;
      const testCompletedSteps: number[] = [];
      const testNextStep = 1;

      const res = completeStepAction(testStepList, testActiveStep, testIsValid, testCompletedSteps, testNextStep);

      expect(res.type).toEqual(COMPLETE_STEP);
      expect(res).toHaveProperty('payload');
      expect((res as any).payload).toHaveProperty('completedSteps');
      expect((res as any).payload).toHaveProperty('activeStep');
    });

    it('should return a SUBMIT type when the activeStep is the last one available and all the steps are completed', () => {
      const testStepList = ['first', 'second', 'third'];
      const testActiveStep = 3;
      const testIsValid = true;
      const testCompletedSteps: number[] = [0, 1, 2];
      const testNextStep: any = 3;

      const res = completeStepAction(testStepList, testActiveStep, testIsValid, testCompletedSteps, testNextStep);

      expect(res.type).toEqual(SUBMIT);
    });

    it('should return a COMPLETE_STEP type when the activeStep is the last one available but not all the steps are completed', () => {
      const testStepList = ['first', 'second', 'third'];
      const testActiveStep = 3;
      const testIsValid = true;
      const testCompletedSteps: number[] = [0, 2];
      const testNextStep: any = 3;

      const res = completeStepAction(testStepList, testActiveStep, testIsValid, testCompletedSteps, testNextStep);

      expect(res.type).toEqual(COMPLETE_STEP);
    });
  });
});
