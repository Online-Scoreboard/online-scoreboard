import gql from 'graphql-tag';

export const GET_GAME = gql`
  query GetGame($gameId: String!) {
    getGame(gameId: $gameId) {
      id
      users
    }
  }
`;

export const GAME_UPDATED = gql`
  subscription GameUpdated {
    gameUpdated {
      id
    }
  }
`;

export const START_GAME = gql`
  mutation StartGame($gameId: String!) {
    startGame(gameId: $gameId) {
      id
    }
  }
`;
