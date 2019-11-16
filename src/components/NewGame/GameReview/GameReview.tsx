import React, { useCallback } from 'react';
import { CardHeader, CardContent, Typography } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';

import { useStyles } from '../NewGame.styles';
import { TeamColor, ScoringSystem } from '../NewGameTypes';

interface GameReviewProps {
  gameName: string;
  rules: {
    startingScore: number;
    winningScore: number;
    winningScoreEnabled: boolean;
    scoringSystem: ScoringSystem;
  };
  teams: number;
  teamColors: TeamColor[];
}

export const GameReview: React.FC<GameReviewProps> = ({ gameName, teams, teamColors, rules }) => {
  const { cardTitle, gameReviewTeamIcons, ...classes } = useStyles();

  const getColorClass = useCallback(
    (color: string) => {
      const colorKey = `${color}Checkbox`;

      return (classes as any)[colorKey];
    },
    [classes]
  );

  const score = rules.scoringSystem === 'both' ? 'increase and decrease' : rules.scoringSystem;
  const winningScore = rules.winningScoreEnabled ? `to ${rules.winningScore}` : '';

  return (
    <>
      <CardHeader title="Game Review" classes={{ title: cardTitle }} />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {gameName}
        </Typography>
        <Typography gutterBottom>{teams} teams</Typography>
        <Typography gutterBottom>
          {teamColors.map(color => (
            <PersonIcon key={color} className={`${gameReviewTeamIcons} ${getColorClass(color)}`} />
          ))}
        </Typography>
        <Typography gutterBottom>
          The teams score will {score} from {rules.startingScore} {winningScore} points
        </Typography>
      </CardContent>
    </>
  );
};
