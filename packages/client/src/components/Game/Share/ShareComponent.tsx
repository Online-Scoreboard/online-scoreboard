import React, { memo } from 'react';
import { Typography, Button, Menu, MenuItem, TextField, Grid } from '@material-ui/core';

import { useMessage } from '../../../hooks/useMessage';

interface Props {
  gameId: string;
}

const Component: React.FC<Props> = ({ gameId }) => {
  const [shareMenuStatus, setShareMenuStatus] = React.useState(null);
  const { createMessage } = useMessage();

  const handleOpenShareMenu = (event: React.MouseEvent<any>) => {
    setShareMenuStatus(event.currentTarget);
  };

  const handleCloseShareMenu = () => {
    setShareMenuStatus(null);
  };

  const handleCopyShareLink = () => {
    createMessage('Game ID copied to clipboard', 'success');

    handleCloseShareMenu();
  };

  return (
    <Grid container direction="row" spacing={1} alignItems="center" className="ShareGame">
      <Grid item>
        <Typography>Game ID: {gameId}</Typography>
      </Grid>
      <Grid item>
        <Button variant="outlined" aria-controls="game-share-menu" aria-haspopup="true" onClick={handleOpenShareMenu}>
          Share Game
        </Button>
        <Menu
          id="game-share-menu"
          anchorEl={shareMenuStatus}
          open={Boolean(shareMenuStatus)}
          onClose={handleCloseShareMenu}
          keepMounted
        >
          <MenuItem dense={true}>
            <Grid container direction="column">
              <Typography variant="inherit">Share this game with other players</Typography>
              <Grid item container direction="row" justify="space-between" alignItems="center">
                <Grid item>
                  <TextField margin="normal" name="gameId" value={gameId} />
                </Grid>
                <Grid item>
                  <Button variant="outlined" onClick={handleCopyShareLink}>
                    copy
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </MenuItem>
        </Menu>
      </Grid>
    </Grid>
  );
};

export const Share = memo(Component);
