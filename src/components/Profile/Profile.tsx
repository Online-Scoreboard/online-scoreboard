import React, { memo, useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { RouteComponentProps } from '@reach/router';
import { uniqueNamesGenerator } from 'unique-names-generator';
import gql from 'graphql-tag';

import { useAuth } from '../../hooks/Auth';
import useStyles from './Profile.styles';
import { ProfileComponent } from './ProfileComponent';

export const SHUFFLE_AVATAR = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(input: $updateUserInput) {
      username
      avatar
    }
  }
`;

type ShuffleAvatarVariables = {
  updateUserInput: {
    avatar: string;
  };
};

export const Profile: React.FC<RouteComponentProps> = memo(() => {
  const classes = useStyles();
  const { user } = useAuth();
  const [shuffleAvatar, { loading: shuffleAvatarLoading }] = useMutation<void, ShuffleAvatarVariables>(SHUFFLE_AVATAR, {
    refetchQueries: ['GetUserData'],
    awaitRefetchQueries: true,
  });

  const handleShuffleAvatar = useCallback(() => {
    shuffleAvatar({
      variables: {
        updateUserInput: { avatar: uniqueNamesGenerator() },
      },
    });
  }, [shuffleAvatar]);

  return (
    <ProfileComponent
      user={user}
      shuffleAvatar={handleShuffleAvatar}
      shuffleAvatarLoading={shuffleAvatarLoading}
      classes={classes}
    />
  );
});
