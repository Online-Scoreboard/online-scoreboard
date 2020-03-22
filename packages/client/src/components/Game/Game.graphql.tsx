import gql from 'graphql-tag';

export const GET_GAME = gql`
  query GetGame($gameId: String!) {
    getGame(gameId: $gameId) {
      id
      name
      owner
      status
      teams
      teamColors
      createdAt
      updatedAt
      users {
        id
        item {
          id
          username
          avatar
        }
      }
      pendingUsers {
        id
        item {
          id
          username
          avatar
        }
      }
      rules {
        isMatchesBased
        scoringSystem
        startingScore
        winningScore
        winningScoreEnabled
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
      pendingUsers {
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
      pendingUsers {
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
      pendingUsers {
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

export const ACCEPT_USER = gql`
  mutation AcceptUser($acceptUserInput: AcceptUserInput!) {
    acceptUser(input: $acceptUserInput) {
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
      pendingUsers {
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

export const REJECT_USER = gql`
  mutation RejectUser($rejectUserInput: RejectUserInput!) {
    rejectUser(input: $rejectUserInput) {
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
      pendingUsers {
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
