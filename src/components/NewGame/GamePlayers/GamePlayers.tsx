import React, { useCallback } from 'react';
import { Grid, Card, CardHeader, CardContent, Typography, Slider, Checkbox } from '@material-ui/core';

import { useStyles } from '../NewGame.styles';
import { PlayerColor } from '../NewGameTypes';

interface GamePlayersProps {
  players: number;
  colors: PlayerColor[];
  playersColors: PlayerColor[];
  onPlayersColorsChange: (playersColors: PlayerColor) => void;
  onPlayersChange: (newPlayers: number) => void;
}

export const GamePlayers: React.FC<GamePlayersProps> = ({
  players,
  colors,
  playersColors,
  onPlayersChange,
  onPlayersColorsChange,
}) => {
  const { card, cardTitle, playersSlider, playersSliderLabel, cardCenteredContent, ...classes } = useStyles();

  const getCheckboxClass = useCallback(
    (color: string) => {
      const colorKey = `${color}Checkbox`;

      return (classes as any)[colorKey];
    },
    [classes]
  );

  const handleChange = useCallback(
    (playerColor: PlayerColor) => (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      return onPlayersColorsChange(playerColor);
    },
    [onPlayersColorsChange]
  );

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
    <Grid item xs={12} sm={10} md={9}>
      <Card className={card} elevation={12}>
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
      </Card>

      <Card className={card} elevation={12}>
        <CardHeader title="Colors" classes={{ title: cardTitle }} />
        <CardContent className={cardCenteredContent}>
          <Typography gutterBottom>Chose some colors for your players</Typography>
          {colors.map(color => (
            <Checkbox
              key={color}
              color="default"
              checked={playersColors.indexOf(color) >= 0}
              classes={{ root: getCheckboxClass(color) }}
              onChange={handleChange(color)}
            />
          ))}
        </CardContent>
      </Card>
    </Grid>
  );
};
