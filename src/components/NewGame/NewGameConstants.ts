import { PlayerColor, ScoringSystem } from './NewGameTypes';

const minGameNameLength = 6;
const maxGameNameLength = 30;
const steps = ['Setup', 'Players', 'Colors', 'Rules'];
const startingStep = 0;
const defaultScoringSystem: ScoringSystem = 'increase';
const defaultStartingScore = 0;
const defaultWinningScore = 10;
const defaultWinningScoreEnabled = false;
const defaultPlayers = 2;
const defaultPlayerColors: PlayerColor[] = ['black', 'white'];
const colors: PlayerColor[] = [
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
export const getDefaultPlayers = () => defaultPlayers;
export const getDefaultPlayerColors = () => defaultPlayerColors;
export const getDefaultStartingScore = () => defaultStartingScore;
export const getDefaultWinningScore = () => defaultWinningScore;
export const getDefaultWinningScoreEnabled = () => defaultWinningScoreEnabled;
export const getDefaultScoringSystem = () => defaultScoringSystem;
export const getMinGameNameLength = () => minGameNameLength;
export const getMaxGameNameLength = () => maxGameNameLength;
