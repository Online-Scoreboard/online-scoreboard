import React, { useCallback } from 'react';
import { CardContent, Typography, CardHeader, Checkbox } from '@material-ui/core';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import PersonIcon from '@material-ui/icons/Person';

import { useStyles } from '../NewGame.styles';
import { TeamColor } from '../NewGameTypes';

interface TeamColorsProps {
  teams: number;
  colors: TeamColor[];
  teamColors: TeamColor[];
  onChange: (teamColors: TeamColor) => void;
}

export const TeamColors: React.FC<TeamColorsProps> = ({ teams, colors, teamColors, onChange }) => {
  const {
    card,
    cardTitle,
    teamsSlider,
    teamsSliderLabel,
    cardCentredContent,
    checkboxChecked,
    ...classes
  } = useStyles();

  const getCheckboxClass = useCallback(
    (color: string) => {
      const colorKey = `${color}Checkbox`;

      return (classes as any)[colorKey];
    },
    [classes]
  );

  const handleChange = useCallback(
    (teamColor: TeamColor) => (_event: React.ChangeEvent<HTMLInputElement>, _checked: boolean) => {
      return onChange(teamColor);
    },
    [onChange]
  );

  return (
    <>
      <CardHeader
        title="Team Colors"
        subheader={`You must chose ${teams} colors`}
        classes={{ title: cardTitle, subheader: cardTitle }}
      />

      <CardContent className={cardCentredContent}>
        <Typography gutterBottom>Chose some colors for your teams</Typography>
        {colors.map(color => (
          <Checkbox
            key={color}
            color="default"
            icon={<PersonOutlineIcon />}
            checkedIcon={<PersonIcon />}
            checked={teamColors.indexOf(color) >= 0}
            classes={{ root: getCheckboxClass(color), checked: checkboxChecked }}
            onChange={handleChange(color)}
          />
        ))}
      </CardContent>
    </>
  );
};
