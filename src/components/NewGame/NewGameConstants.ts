import { PlayerColor } from './NewGameTypes';

const minGameNameLength = 6;
const maxGameNameLength = 30;
const steps = ['Setup', 'Players', 'Colors', 'Rules'];
const startingStep = 0;
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
];

export const getSteps = () => steps;
export const getStartingStep = () => startingStep;
export const getColors = () => colors;
export const getDefaultPlayers = () => defaultPlayers;
export const getDefaultPlayerColors = () => defaultPlayerColors;
export const getMinGameNameLength = () => minGameNameLength;
export const getMaxGameNameLength = () => maxGameNameLength;
