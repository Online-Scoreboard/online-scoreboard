import React, { useCallback } from 'react';
import { CardHeader, CardContent, Typography, Slider } from '@material-ui/core';

import { useStyles } from '../NewGame.styles';

interface GamePlayersProps {
  players: number;
  onPlayersChange: (newPlayers: number) => void;
}

export const GamePlayers: React.FC<GamePlayersProps> = ({ players, onPlayersChange }) => {
  const { cardTitle, playersSlider, playersSliderLabel } = useStyles();

  const handleSlider = useCallback(
    (event: React.ChangeEvent<{}>, value: number | number[]) => {
      if (Array.isArray(value)) {
        return;
      }

      onPlayersChange(value);
    },
    [onPlayersChange]
  );

  return (
    <>
      <CardHeader title="Players" classes={{ title: cardTitle }} />

      <CardContent>
        <Typography id="players-slider" gutterBottom>
          How many players/teams are going to participate?
        </Typography>

        <Slider
          className={playersSlider}
          classes={{ thumb: playersSliderLabel }}
          aria-labelledby="players-slider"
          valueLabelDisplay="on"
          onChange={handleSlider}
          defaultValue={players}
          min={1}
          max={12}
          step={1}
          marks
        />
      </CardContent>
    </>
  );
};
