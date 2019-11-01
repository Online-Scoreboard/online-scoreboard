import React from 'react';
import { useStyles } from '../NewGame.styles';
import { Grid, Card, CardHeader, CardContent, TextField } from '@material-ui/core';

interface GameNameProps {
  gameName: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const GameName: React.FC<GameNameProps> = ({ gameName, handleChange }) => {
  const { card, cardTitle } = useStyles();

  return (
    <Grid item xs={12} sm={10} md={9}>
      <Card className={card} elevation={12}>
        <CardHeader title="Game Name" classes={{ title: cardTitle }} />
        <CardContent>
          <TextField
            className="gameName"
            label="Chose a name for your game"
            placeholder="Game Name"
            variant="outlined"
            value={gameName}
            onChange={handleChange}
            fullWidth
          />
        </CardContent>
      </Card>
    </Grid>
  );
};
