import { TeamColor, GameListItem } from '../NewGameTypes';
import { gamesList } from '../GameRules/GameList';

const startingStep = 0;
const minGameNameLength = 6;
const maxGameNameLength = 30;
const steps = ['Setup', 'Rules', 'Teams', 'Colors'];
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

const defaultGameRules: GameListItem = gamesList[0];

export const getSteps = () => steps;
export const getStartingStep = () => startingStep;
export const getColors = () => colors;
export const getDefaultTeams = () => defaultTeams;
export const getDefaultTeamColors = () => defaultTeamColors;
export const getMinGameNameLength = () => minGameNameLength;
export const getMaxGameNameLength = () => maxGameNameLength;
export const getDefaultGameRules = () => defaultGameRules;
