export type TeamColor =
  | 'white'
  | 'red'
  | 'yellow'
  | 'blue'
  | 'green'
  | 'gray'
  | 'pink'
  | 'brown'
  | 'lime'
  | 'teal'
  | 'purple'
  | 'gold'
  | 'aquamarine'
  | 'darkorange'
  | 'black';

export type ScoringSystem = 'increase' | 'decrease' | 'both';

export interface GameListItem {
  name: string;
  minTeamSize: number;
  maxTeamSize: number;
  startingScore: number;
  winningScore: number;
  winningScoreEnabled: boolean;
  scoringSystem: ScoringSystem;
  isMatchesBased: boolean;
}
