import React, { useCallback } from 'react';
import { CardHeader, CardContent, Typography } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';

import { useStyles } from '../NewGame.styles';
import { TeamColor, GameListItem } from '../NewGameTypes';

interface GameReviewProps {
  gameName: string;
  rules: GameListItem;
  teams: number;
  teamColors: TeamColor[];
}

export const GameReview: React.FC<GameReviewProps> = ({ gameName, teams, teamColors, rules }) => {
  const { cardTitle, gameReviewTeamIcons, ...classes } = useStyles();
  const {
    scoringSystem,
    winningScoreEnabled,
    winningScore: winningScoreVal,
    startingScore,
    isMatchesBased,
    name,
  } = rules;

  const getColorClass = useCallback(
    (color: string) => {
      const colorKey = `${color}Checkbox`;

      return (classes as any)[colorKey];
    },
    [classes]
  );

  const score = scoringSystem === 'both' ? 'increase and decrease' : scoringSystem;
  const winningScore = winningScoreEnabled ? `to ${winningScoreVal}` : '';

  return (
    <>
      <CardHeader title="Game Review" classes={{ title: cardTitle }} />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {gameName}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {name ? `"${name}"` : 'A custom configuration'} has been used for setting this game base rules
        </Typography>
        <Typography gutterBottom>{teams} teams</Typography>
        <Typography gutterBottom>
          {teamColors.map(color => (
            <PersonIcon
              key={color}
              className={`${gameReviewTeamIcons} ${getColorClass(color)}`}
              style={{ opacity: 1, fontSize: '5rem' }}
            />
          ))}
        </Typography>
        <Typography>This is a {isMatchesBased ? 'matches' : 'points'} based game</Typography>
        <Typography gutterBottom>
          The teams score will {score} from {startingScore} {winningScore} points{' '}
          {!winningScore && 'until the end of the game'}
        </Typography>
      </CardContent>
    </>
  );
};
