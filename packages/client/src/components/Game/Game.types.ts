export interface UserData {
  id: string;
  username: string;
  avatar: string;
}

export interface GameUserData {
  id: string;
  item?: UserData;
}

export interface Game {
  id: string;
  owner: string;
  status: 'new' | 'started' | 'ended';
  pendingPlayers?: GameUserData[];
  users?: GameUserData[];
}
