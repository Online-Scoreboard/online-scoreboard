import { TeamColor, ScoringSystem } from './NewGameTypes';

const startingStep = 0;
const minGameNameLength = 6;
const maxGameNameLength = 30;
const steps = ['Setup', 'Rules', 'Teams', 'Colors'];
const defaultScoringSystem: ScoringSystem = 'increase';
const defaultStartingScore = 0;
const defaultWinningScore = 10;
const defaultWinningScoreEnabled = false;
const defaultTeams = 2;
const defaultTeamColors: TeamColor[] = ['black', 'white'];
const colors: TeamColor[] = [
  'black',
  'white',
  'red',
  'yellow',
  'blue',
  'green',
  'gray',
  'pink',
  'brown',
  'lime',
  'teal',
  'purple',
  'gold',
  'aquamarine',
  'darkorange',
];

export const getSteps = () => steps;
export const getStartingStep = () => startingStep;
export const getColors = () => colors;
export const getDefaultTeams = () => defaultTeams;
export const getDefaultTeamColors = () => defaultTeamColors;
export const getDefaultStartingScore = () => defaultStartingScore;
export const getDefaultWinningScore = () => defaultWinningScore;
export const getDefaultWinningScoreEnabled = () => defaultWinningScoreEnabled;
export const getDefaultScoringSystem = () => defaultScoringSystem;
export const getMinGameNameLength = () => minGameNameLength;
export const getMaxGameNameLength = () => maxGameNameLength;
