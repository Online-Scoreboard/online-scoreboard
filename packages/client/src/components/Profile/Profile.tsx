import React, { memo, useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { RouteComponentProps } from '@reach/router';

import { useAuth } from '../../hooks/Auth';
import { useStyles } from './Profile.styles';
import { ProfileComponent } from './ProfileComponent';
import { SHUFFLE_AVATAR, UPDATE_USERNAME } from './Profile.graphql';
import { GET_USER_DATA } from '../../hooks/Auth/useAuth.graph';

interface UpdateUsernameVariables {
  updateUserInput: {
    username: string;
  };
}

export const Profile: React.FC<RouteComponentProps> = memo(() => {
  const classes = useStyles();
  const { user } = useAuth();
  const [shuffleAvatar, { loading: shuffleAvatarLoading }] = useMutation<void, void>(SHUFFLE_AVATAR, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_USER_DATA }],
  });
  const [saveUsername, { loading: saveUsernameLoading }] = useMutation<void, UpdateUsernameVariables>(UPDATE_USERNAME, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_USER_DATA }],
  });

  const handleShuffleAvatar = useCallback(() => {
    shuffleAvatar();
  }, [shuffleAvatar]);

  const handleSaveUsername = useCallback(
    (username: string) => {
      saveUsername({
        variables: {
          updateUserInput: { username },
        },
      });
    },
    [saveUsername]
  );

  return (
    <ProfileComponent
      shuffleAvatar={handleShuffleAvatar}
      saveUsername={handleSaveUsername}
      shuffleAvatarLoading={shuffleAvatarLoading}
      saveUsernameLoading={saveUsernameLoading}
      user={user}
      classes={classes}
    />
  );
});
