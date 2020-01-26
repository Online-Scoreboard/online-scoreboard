import React, { useCallback } from 'react';
import { CardHeader, CardContent, Typography, Slider } from '@material-ui/core';

import { useStyles } from '../NewGame.styles';

interface GameTeamsProps {
  teams: number;
  onChange: (newTeams: number) => void;
}

export const GameTeams: React.FC<GameTeamsProps> = ({ teams, onChange }) => {
  const { cardTitle, teamsSlider, teamsSliderLabel } = useStyles();

  const handleSlider = useCallback(
    (event: React.ChangeEvent<{}>, value: number | number[]) => {
      if (Array.isArray(value)) {
        return;
      }

      onChange(value);
    },
    [onChange]
  );

  return (
    <>
      <CardHeader title="Teams" classes={{ title: cardTitle }} />

      <CardContent>
        <Typography id="teams-slider" gutterBottom>
          How many teams are going to participate?
        </Typography>

        <Slider
          className={teamsSlider}
          classes={{ thumb: teamsSliderLabel }}
          valueLabelDisplay="on"
          onChange={handleSlider}
          value={teams}
          min={1}
          max={12}
          step={1}
          marks
        />
      </CardContent>
    </>
  );
};
