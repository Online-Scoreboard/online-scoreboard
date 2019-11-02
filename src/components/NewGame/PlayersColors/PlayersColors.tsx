import React, { useCallback } from 'react';
import { CardContent, Typography, CardHeader, Checkbox } from '@material-ui/core';

import { useStyles } from '../NewGame.styles';
import { PlayerColor } from '../NewGameTypes';

interface GamePlayersProps {
  players: number;
  colors: PlayerColor[];
  playersColors: PlayerColor[];
  onPlayersColorsChange: (playersColors: PlayerColor) => void;
}

export const PlayersColors: React.FC<GamePlayersProps> = ({
  players,
  colors,
  playersColors,
  onPlayersColorsChange,
}) => {
  const { card, cardTitle, playersSlider, playersSliderLabel, cardCentredContent, ...classes } = useStyles();

  const getCheckboxClass = useCallback(
    (color: string) => {
      const colorKey = `${color}Checkbox`;

      return (classes as any)[colorKey];
    },
    [classes]
  );

  const handleChange = useCallback(
    (playerColor: PlayerColor) => (_event: React.ChangeEvent<HTMLInputElement>, _checked: boolean) => {
      return onPlayersColorsChange(playerColor);
    },
    [onPlayersColorsChange]
  );

  return (
    <>
      <CardHeader
        title="Players Colors"
        subheader={`You must chose ${players} colors`}
        classes={{ title: cardTitle, subheader: cardTitle }}
      />

      <CardContent className={cardCentredContent}>
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
    </>
  );
};
