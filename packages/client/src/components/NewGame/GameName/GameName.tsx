import React, { useCallback } from 'react';
import { useStyles } from '../NewGame.styles';
import { CardHeader, CardContent, TextField } from '@material-ui/core';

interface GameNameProps {
  gameName: string;
  onChange: (value: string) => void;
}

export const GameName: React.FC<GameNameProps> = ({ gameName, onChange }) => {
  const { cardTitle } = useStyles();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  return (
    <>
      <CardHeader title="Game Name" classes={{ title: cardTitle }} />
      <CardContent>
        <TextField
          className="gameName"
          label="Chose a name for your game"
          placeholder="Game Name"
          variant="outlined"
          value={gameName}
          onChange={handleChange}
          autoFocus
          fullWidth
        />
      </CardContent>
    </>
  );
};
