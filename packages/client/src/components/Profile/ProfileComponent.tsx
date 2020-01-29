import React, { memo, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  TextField,
} from '@material-ui/core';
import { Avatar } from 'react-avataaars';

import { User } from '../../hooks/Auth';
import { Classes } from './Profile.styles';

interface ProfileComponentProps {
  user: User;
  classes: Classes;
  shuffleAvatarLoading: boolean;
  saveUsernameLoading: boolean;
  shuffleAvatar: () => void;
  saveUsername: (username: string) => void;
}

export const ProfileComponent: React.FC<ProfileComponentProps> = memo(
  ({ shuffleAvatar, shuffleAvatarLoading, saveUsername, saveUsernameLoading, user, classes }) => {
    const { root, pageTitle, content, card, cardTitle, cardAction, avatar } = classes;

    const [username, setUsername] = useState(user.username);

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(event.target.value);
    };

    const handleSaveUsername = useCallback(() => {
      saveUsername(username);
    }, [saveUsername, username]);

    return (
      <Container component="main" className={`${root} Profile`}>
        <Typography component="h1" variant="h2" align="center" color="textPrimary" className={pageTitle}>
          Profile
        </Typography>

        <Container maxWidth="sm" className={content}>
          <Card className={card} elevation={10} id="card-username">
            <CardHeader title="Username" className="card-username__title" classes={{ title: cardTitle }} />
            <CardContent>
              <TextField
                className="username"
                label="Username"
                variant="outlined"
                value={username}
                onChange={handleUsernameChange}
                disabled={saveUsernameLoading}
              />
            </CardContent>
            <CardActions>
              <Button
                className={`${cardAction} saveUsername`}
                startIcon={saveUsernameLoading && <CircularProgress size={24} />}
                disabled={saveUsernameLoading}
                onClick={handleSaveUsername}
              >
                Save
              </Button>
            </CardActions>
          </Card>
        </Container>

        <Container maxWidth="sm" className={content}>
          <Card className={card} elevation={10} id="card-avatar">
            <CardHeader title="Avatar" className="card-avatar__title" classes={{ title: cardTitle }} />
            <CardContent>
              <Avatar hash={user.avatar} className={avatar} />
            </CardContent>
            <CardActions>
              <Button
                className={`${cardAction} shuffleAvatar`}
                startIcon={shuffleAvatarLoading && <CircularProgress size={24} />}
                disabled={shuffleAvatarLoading}
                onClick={shuffleAvatar}
              >
                Chose New Avatar
              </Button>
            </CardActions>
          </Card>
        </Container>
      </Container>
    );
  }
);
