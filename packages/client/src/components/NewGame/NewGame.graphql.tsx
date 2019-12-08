import gql from 'graphql-tag';

export const CREATE_GAME = gql`
  mutation CreateGame($createGameInput: CreateGameInput!) {
    createGame(input: $createGameInput) {
      id
    }
  }
`;
