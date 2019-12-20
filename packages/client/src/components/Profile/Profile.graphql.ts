import gql from 'graphql-tag';

export const SHUFFLE_AVATAR = gql`
  mutation ShuffleAvatar {
    shuffleAvatar {
      avatar
    }
  }
`;

export const UPDATE_USERNAME = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(input: $updateUserInput) {
      username
    }
  }
`;
