import { TeamColor } from '../NewGame/NewGameTypes';

export interface UserData {
  id: string;
  username: string;
  avatar: string;
}

export interface GameUserData {
  id: string;
  item?: UserData;
}

export interface GameRules {
  isMatchesBased: boolean;
  scoringSystem: 'increase' | 'decrease';
  startingScore: number;
  winningScore: number;
  winningScoreEnabled: boolean;
}

export interface Game {
  id: string;
  name: string;
  owner: string;
  status: 'new' | 'started' | 'ended';
  teams: number;
  teamColors: TeamColor[];
  createdAt: string;
  updatedAt: string;
  rules: GameRules;
  pendingUsers?: GameUserData[];
  users?: GameUserData[];
}
