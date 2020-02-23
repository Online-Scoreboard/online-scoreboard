import gql from 'graphql-tag';

export const GET_GAME = gql`
  query GetGame($gameId: String!) {
    getGame(gameId: $gameId) {
      id
      name
      owner
      status
      users {
        id
        item {
          id
          username
          avatar
        }
      }
      pendingPlayers {
        id
        item {
          id
          username
          avatar
        }
      }
    }
  }
`;

export const GAME_UPDATED = gql`
  subscription GameUpdated($id: String!) {
    gameUpdated(id: $id) {
      id
      owner
      status
      users {
        id
        item {
          id
          username
          avatar
        }
      }
      pendingPlayers {
        id
        item {
          id
          username
          avatar
        }
      }
    }
  }
`;

export const START_GAME = gql`
  mutation StartGame($gameId: String!) {
    startGame(gameId: $gameId) {
      id
      owner
      status
      users {
        id
        item {
          id
          username
          avatar
        }
      }
      pendingPlayers {
        id
        item {
          id
          username
          avatar
        }
      }
    }
  }
`;

export const JOIN_GAME = gql`
  mutation JoinGame($gameId: String!) {
    joinGame(gameId: $gameId) {
      id
      owner
      status
      users {
        id
        item {
          id
          username
          avatar
        }
      }
      pendingPlayers {
        id
        item {
          id
          username
          avatar
        }
      }
    }
  }
`;

export const ACCEPT_PLAYER = gql`
  mutation AcceptPlayer($acceptPlayerInput: AcceptPlayerInput!) {
    acceptPlayer(input: $acceptPlayerInput) {
      id
      owner
      status
      users {
        id
        item {
          id
          username
          avatar
        }
      }
      pendingPlayers {
        id
        item {
          id
          username
          avatar
        }
      }
    }
  }
`;

export const REJECT_PLAYER = gql`
  mutation RejectPlayer($rejectPlayerInput: RejectPlayerInput!) {
    rejectPlayer(input: $rejectPlayerInput) {
      id
      owner
      status
      users {
        id
        item {
          id
          username
          avatar
        }
      }
      pendingPlayers {
        id
        item {
          id
          username
          avatar
        }
      }
    }
  }
`;
