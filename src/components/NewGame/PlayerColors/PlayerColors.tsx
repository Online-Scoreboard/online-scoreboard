import React, { useCallback } from 'react';
import { CardContent, Typography, CardHeader, Checkbox } from '@material-ui/core';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import PersonIcon from '@material-ui/icons/Person';

import { useStyles } from '../NewGame.styles';
import { PlayerColor } from '../NewGameTypes';

interface GamePlayersProps {
  players: number;
  colors: PlayerColor[];
  playerColors: PlayerColor[];
  onChange: (playerColors: PlayerColor) => void;
}

export const PlayerColors: React.FC<GamePlayersProps> = ({ players, colors, playerColors, onChange }) => {
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
      return onChange(playerColor);
    },
    [onChange]
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
            icon={<PersonOutlineIcon />}
            checkedIcon={<PersonIcon />}
            checked={playerColors.indexOf(color) >= 0}
            classes={{ root: getCheckboxClass(color) }}
            onChange={handleChange(color)}
          />
        ))}
      </CardContent>
    </>
  );
};
