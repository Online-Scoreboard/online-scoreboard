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
  Typography,
  Grid,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { useStyles } from '../NewGame.styles';
import { GameListItem } from '../NewGameTypes';
import { gamesList } from './GameList';

const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
  },
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiExpansionPanelDetails);

interface GameRulesProps {
  rules: GameListItem;
  onChange: (payload: { [name: string]: string | boolean }) => void;
  onGameRuleChange: (payload: GameListItem) => void;
}

export const GameRules: React.FC<GameRulesProps> = ({ rules, onChange, onGameRuleChange }) => {
  const { cardTitle, content } = useStyles();
  const {
    startingScore,
    winningScore,
    winningScoreEnabled,
    scoringSystem,
    maxTeamSize,
    minTeamSize,
    isMatchesBased,
  } = rules;

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

  const handleGameRuleChange = useCallback(
    (e, game: any) => {
      onGameRuleChange(game);
    },
    [onGameRuleChange]
  );

  return (
    <>
      <CardHeader title="Game Rules" classes={{ title: cardTitle }} />
      <CardContent>
        <Grid item className={content}>
          <Typography gutterBottom>Chose a game from the available ones</Typography>
          <Autocomplete
            id="gameRulesAutocomplete"
            options={gamesList}
            getOptionLabel={(option: GameListItem) => option.name}
            onChange={handleGameRuleChange}
            value={rules}
            renderInput={params => (
              <TextField {...params} helperText="The basic rules to apply to your game" variant="outlined" fullWidth />
            )}
            autoHighlight
          />
        </Grid>

        <Typography gutterBottom>Otherwise define your custom rules in the advanced section</Typography>
        <ExpansionPanel square>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="advanced-game-rules"
            id="advanced-game-rules"
          >
            <Typography>Advanced Rules</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container direction="column">
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

              <FormControl component="fieldset" className={`${content} scoringSystem`}>
                <FormLabel component="legend">Team scores should</FormLabel>
                <RadioGroup
                  aria-label="scoring system"
                  name="scoringSystem"
                  value={scoringSystem}
                  onChange={handleChange}
                >
                  <FormControlLabel value="increase" control={<Radio color="primary" />} label="Increase" />
                  <FormControlLabel value="decrease" control={<Radio color="primary" />} label="Decrease" />
                  <FormControlLabel value="both" control={<Radio color="primary" />} label="Increase and Decrease" />
                </RadioGroup>
              </FormControl>

              <FormControlLabel
                className="isMatchesBased"
                control={
                  <Checkbox name="isMatchesBased" color="primary" checked={isMatchesBased} onChange={handleChange} />
                }
                label="Is the game matches based?"
              />
              <Typography variant="caption" className={content}>
                Each point will be equal to a won match rather than a score within a single game
              </Typography>

              <TextField
                className={`${content} minTeamSize`}
                name="minTeamSize"
                label="Minimum team size"
                placeholder="Minimum team size"
                variant="outlined"
                helperText={`Minimum team size required by the game rules`}
                type="number"
                value={minTeamSize}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                className={`${content} minTeamSize`}
                name="maxTeamSize"
                label="Maximum team size"
                placeholder="Maximum team size"
                variant="outlined"
                helperText={`Maximum team size required by the game rules`}
                type="number"
                value={maxTeamSize}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </CardContent>
    </>
  );
};
