import { setupAction, teamsAction, colorsAction, customRulesAction } from './NewGameActions';
import { NewGameActionType, SETUP, TEAMS, COLORS, RULES } from './NewGameActionTypes';
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
  });

  describe('predefinedRulesAction', () => {});
  describe('completeStepAction', () => {});
});
