import React, { memo } from 'react';
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  CardHeader,
} from '@material-ui/core';
import { Avatar } from 'react-avataaars';

import { User } from '../../hooks/Auth';

interface ProfileComponentProps {
  user: User;
  shuffleAvatar: () => void;
  shuffleAvatarLoading: boolean;
  classes: Record<'root' | 'heroContent' | 'card' | 'cardTitle' | 'cardAction' | 'cardAction' | 'avatar', string>;
}

export const ProfileComponent: React.FC<ProfileComponentProps> = memo(
  ({ shuffleAvatar, shuffleAvatarLoading, user, classes }) => {
    const { root, heroContent, card, cardTitle, cardAction, avatar } = classes;

    return (
      <Container component="main" className={`${root} Profile`}>
        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          Profile
        </Typography>

        <Container maxWidth="md" className={heroContent}>
          <Container maxWidth="sm">
            <Card className={card} elevation={12}>
              <CardHeader title="Avatar" classes={{ title: cardTitle }} />
              <CardContent>
                <Avatar hash={user.avatar} className={avatar} />
              </CardContent>
              <CardActions>
                <Button
                  className={cardAction}
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
      </Container>
    );
  }
);
