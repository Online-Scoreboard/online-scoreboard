import React, { memo, useEffect, useCallback } from 'react';
import {
  Typography,
  Button,
  CircularProgress,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';

import useStyles from './Game.styles';
import { StaticNotification } from '../StaticNotification';
import { usePendingUsers } from './usePendingUsers';
import { Share } from './Share';
import { Users } from './Users';
import { useStaticMessage } from '../../hooks/useStaticMessage';
import { User } from '../../hooks/Auth';
import { Game } from './Game.types';
import { Avatar } from 'react-avataaars';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

interface Props {
  gameData: Game;
  user: User;
  operationLoading: boolean;
  startGame: () => void;
  joinGame: () => void;
  acceptUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
}

const Component: React.FC<Props> = ({
  gameData,
  user,
  startGame,
  joinGame,
  acceptUser,
  rejectUser,
  operationLoading,
}) => {
  const { id, name, status, users = [], pendingUsers = [] } = gameData;
  const userId = user.id || '';

  const {
    loader,
    root,
    content,
    avatarIcon,
    emptyAvatarIcon,
    listItemIconWrapper,
    listItemIcon,
    ...classes
  } = useStyles();
  const { staticMessage, setStaticMessage } = useStaticMessage();
  const { pendingUser, isAcceptedUser, isPendingUser } = usePendingUsers(pendingUsers, users, userId);

  useEffect(() => {
    if (!pendingUser) {
      setStaticMessage('');
    }
    if (pendingUser.id) {
      setStaticMessage(`User "${pendingUser.name}" wants to join the game`);
    } else if (staticMessage) {
      setStaticMessage('');
    }
  }, [pendingUser, staticMessage, setStaticMessage]);

  const handleAcceptUser = (userId: string) => {
    acceptUser(userId);
  };

  const getTeamColor = useCallback(
    (color: string) => {
      const colorKey = `${color}Avatar`;

      return (classes as any)[colorKey];
    },
    [classes]
  );

  return (
    <Container component="main" className={`${root} Game`}>
      <StaticNotification
        message={staticMessage}
        open={Boolean(staticMessage)}
        handleOk={() => acceptUser(pendingUser.id)}
        handleCancel={() => rejectUser(pendingUser.id)}
      />
      <Container maxWidth="md" className={content}>
        <Grid container direction="column" spacing={4}>
          {isAcceptedUser(user.id) && (
            <Grid item>
              <Share gameId={id} />
            </Grid>
          )}

          {!isAcceptedUser(user.id) && !isPendingUser() ? (
            <Grid item>
              <Button variant="outlined" disabled={operationLoading} onClick={joinGame}>
                {operationLoading && <CircularProgress size={24} className={loader} />}
                Ask to Join this Game
              </Button>
            </Grid>
          ) : null}

          <Grid item>
            <Users
              users={users}
              pendingUsers={pendingUsers}
              onAcceptUser={handleAcceptUser}
              onRejectUser={rejectUser}
              isAcceptedUser={isAcceptedUser(user.id)}
            />
          </Grid>

          <Typography align="center" variant="h2">
            {name}
          </Typography>
        </Grid>
      </Container>

      <Grid container alignContent="center" direction="column">
        {isAcceptedUser(user.id) && status === 'new' ? (
          <Button variant="outlined" size="large" disabled={operationLoading} onClick={startGame}>
            {operationLoading && <CircularProgress size={24} className={loader} />}
            Start Game
          </Button>
        ) : null}
      </Grid>

      <Grid container direction="column">
        <List className="teamsList">
          {gameData.teamColors.map(teamColor => (
            <ListItem key={teamColor} divider button>
              <ListItemIcon className={listItemIconWrapper}>
                <div className={`${getTeamColor(teamColor)} ${listItemIcon}`}>
                  <PersonOutlineIcon className={emptyAvatarIcon} />
                  <Avatar size="54px" hash={user.avatar} className={avatarIcon} />
                </div>
              </ListItemIcon>
              <ListItemText primary={teamColor} secondary="Jan 9, 2014" />
              {isAcceptedUser(user.id) && (
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => {
                    //
                  }}
                >
                  Claim
                </Button>
              )}
            </ListItem>
          ))}
        </List>
      </Grid>

      <Grid container alignContent="center" direction="column">
        {isAcceptedUser(user.id) && status === 'started' ? (
          <Button variant="outlined" size="large" disabled={operationLoading} onClick={startGame}>
            {operationLoading && <CircularProgress size={24} className={loader} />}
            End Game
          </Button>
        ) : null}
      </Grid>
    </Container>
  );
};

export const GameComponent = memo(Component);
