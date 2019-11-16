import React, { useCallback } from 'react';
import {
  CardHeader,
  CardContent,
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
} from '@material-ui/core';

import { useStyles } from '../NewGame.styles';
import { ScoringSystem } from '../NewGameTypes';

interface GameRulesProps {
  startingScore: number;
  winningScore: number;
  winningScoreEnabled: boolean;
  scoringSystem: ScoringSystem;
  onChange: (payload: { [name: string]: string | boolean }) => void;
}

export const GameRules: React.FC<GameRulesProps> = ({
  startingScore,
  winningScore,
  winningScoreEnabled,
  scoringSystem,
  onChange,
}) => {
  const { cardTitle, content } = useStyles();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = event.target;

      if (!name) {
        return;
      }

      if (type === 'number') {
        const formattedValue = !value ? '0' : value.replace(/^(-?)0+(\d)/, '$1$2');
        const positiveValue = formattedValue.replace(/^-/, '');

        if (positiveValue.length > 4) {
          return;
        }

        onChange({
          [name]: formattedValue,
        });
      }

      if (type === 'checkbox') {
        onChange({
          [name]: checked,
        });
      }

      if (type === 'radio') {
        onChange({
          [name]: value,
        });
      }
    },
    [onChange]
  );

  return (
    <>
      <CardHeader title="Game Rules" classes={{ title: cardTitle }} />
      <CardContent>
        <TextField
          className={`${content} startingScore`}
          name="startingScore"
          label="Teams starting score"
          placeholder="Teams starting score"
          variant="outlined"
          helperText={`Teams start at ${startingScore} points`}
          type="number"
          value={startingScore}
          onChange={handleChange}
          fullWidth
          autoFocus
        />

        <FormControlLabel
          className={`${content} winningScoreEnabled`}
          control={
            <Checkbox
              name="winningScoreEnabled"
              color="primary"
              checked={winningScoreEnabled}
              onChange={handleChange}
            />
          }
          label="Enable winning score condition"
        />

        <TextField
          className={`${content} endingScore`}
          name="winningScore"
          label="Teams winning score"
          placeholder="Teams winning score"
          variant="outlined"
          helperText={`Teams win at ${winningScore} points`}
          type="number"
          value={winningScore}
          onChange={handleChange}
          disabled={!winningScoreEnabled}
          fullWidth
        />

        <FormControl component="fieldset" className="scoringSystem">
          <FormLabel component="legend">Team scores should</FormLabel>
          <RadioGroup aria-label="scoring system" name="scoringSystem" value={scoringSystem} onChange={handleChange}>
            <FormControlLabel value="increase" control={<Radio color="primary" />} label="Increase" />
            <FormControlLabel value="decrease" control={<Radio color="primary" />} label="Decrease" />
            <FormControlLabel value="both" control={<Radio color="primary" />} label="Increase and Decrease" />
          </RadioGroup>
        </FormControl>
      </CardContent>
    </>
  );
};
