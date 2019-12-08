import gql from 'graphql-tag';

export const SHUFFLE_AVATAR = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(input: $updateUserInput) {
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
