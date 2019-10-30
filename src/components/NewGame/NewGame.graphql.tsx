import gql from 'graphql-tag';

export const NEW_GAME = gql`
  mutation CreateGame($createGameInput: CreateGameInput!) {
    updateUser(input: $createGameInput) {
      id
    }
  }
`;
