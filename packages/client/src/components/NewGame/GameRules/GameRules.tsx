import React, { useCallback, useMemo, useRef } from 'react';
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
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { useStyles } from '../NewGame.styles';
import { GameListItem } from '../NewGameTypes';
import { gamesList } from './GameList';

interface GameRulesProps {
  rules: GameListItem;
  onChange: (payload: { [name: string]: string | boolean }) => void;
  onGameRuleChange: (payload: GameListItem) => void;
}

export const GameRules: React.FC<GameRulesProps> = ({ rules, onChange, onGameRuleChange }) => {
  const { cardTitle, expansionPanelRoot, expansionPanelSummaryRoot, expansionPanelDetailsRoot, content } = useStyles();
  const {
    startingScore,
    winningScore,
    winningScoreEnabled,
    scoringSystem,
    maxTeamSize,
    minTeamSize,
    isMatchesBased,
  } = rules;

  const textInput = useRef(null);

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
      if (!game) {
        return onChange({
          clear: true,
        });
      }

      onGameRuleChange(game);
    },
    [onChange, onGameRuleChange]
  );

  const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { target } = event;
    target.select();
  }, []);

  const getWinningScoreHelpingText = useMemo(() => {
    if (isMatchesBased) {
      return `The winning team will be determined at the end of ${winningScore} ${
        String(winningScore) === '1' ? 'match' : 'matches'
      }`;
    }
    return `First teams to reach ${winningScore} ${String(winningScore) === '1' ? 'point' : 'points'} wins`;
  }, [isMatchesBased, winningScore]);

  return (
    <>
      <CardHeader title="Game Rules" className="GameRulesHeader" classes={{ title: cardTitle }} />
      <CardContent>
        <Grid item className={content}>
          <Typography gutterBottom>Choose a game from the available ones</Typography>
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
        <ExpansionPanel square classes={{ root: expansionPanelRoot }}>
          <ExpansionPanelSummary
            classes={{ root: expansionPanelSummaryRoot }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="advanced-game-rules"
            id="advanced-game-rules"
          >
            <Typography>Advanced Rules</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails classes={{ root: expansionPanelDetailsRoot }}>
            <Grid container direction="column">
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

              {!isMatchesBased && (
                <TextField
                  className={`${content} startingScore`}
                  name="startingScore"
                  label="Teams starting score"
                  placeholder="Teams starting score"
                  variant="outlined"
                  helperText={`Teams start at ${startingScore} points`}
                  type="number"
                  value={startingScore}
                  inputRef={(el: any) => (textInput.current = el)}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                />
              )}

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
                label={`Enable winning ${isMatchesBased ? 'matches' : 'score'} condition`}
              />

              {winningScoreEnabled && (
                <TextField
                  className={`${content} endingScore`}
                  name="winningScore"
                  label={`Teams winning ${isMatchesBased ? 'matches' : 'score'}`}
                  placeholder={`Teams winning ${isMatchesBased ? 'matches' : 'score'}`}
                  variant="outlined"
                  helperText={getWinningScoreHelpingText}
                  type="number"
                  value={winningScore}
                  inputRef={(el: any) => (textInput.current = el)}
                  onFocus={handleFocus}
                  onChange={handleChange}
                  fullWidth
                />
              )}

              {!isMatchesBased && (
                <FormControl component="fieldset" className={`${content} scoringSystem`}>
                  <FormLabel component="legend">Team scores should</FormLabel>
                  <RadioGroup
                    aria-label="scoring system"
                    name="scoringSystem"
                    value={scoringSystem}
                    onChange={handleChange}
                  >
                    {((winningScoreEnabled && startingScore < winningScore) || !winningScoreEnabled) && (
                      <FormControlLabel value="increase" control={<Radio color="primary" />} label="Increase" />
                    )}
                    {((winningScoreEnabled && startingScore > winningScore) || !winningScoreEnabled) && (
                      <FormControlLabel value="decrease" control={<Radio color="primary" />} label="Decrease" />
                    )}
                    <FormControlLabel value="both" control={<Radio color="primary" />} label="Increase and Decrease" />
                  </RadioGroup>
                </FormControl>
              )}

              <TextField
                className={`${content} minTeamSize`}
                name="minTeamSize"
                label="Minimum number of teams"
                variant="outlined"
                helperText={`Minimum team size required by the game rules`}
                type="number"
                inputProps={{ min: '1', max: '12', step: '1' }}
                inputRef={(el: any) => (textInput.current = el)}
                value={minTeamSize}
                onFocus={handleFocus}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                className={`${content} minTeamSize`}
                name="maxTeamSize"
                label="Maximum number of teams"
                variant="outlined"
                helperText={`Maximum team size required by the game rules`}
                type="number"
                inputProps={{ min: '1', max: '12', step: '1' }}
                inputRef={(el: any) => (textInput.current = el)}
                value={maxTeamSize}
                onFocus={handleFocus}
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
