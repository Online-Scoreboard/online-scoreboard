import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { usePendingUsers } from './usePendingUsers';
import { GameUserData } from './Game.types';

describe('usePendingUsers', () => {
  interface DivProps {
    hook: any;
  }

  const Div: React.FC<DivProps> = () => <div />;

  interface TestComponentProps {
    pendingUsers: GameUserData[];
    users: GameUserData[];
    userId: string;
  }

  const TestComponent: React.FC<TestComponentProps> = ({ pendingUsers, users, userId }) => {
    const pendingUsersHook = usePendingUsers(pendingUsers, users, userId);
    return <Div hook={pendingUsersHook} />;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a usePendingUsers hook without crashing', () => {
    const pendingUsers: GameUserData[] = [];
    const users: GameUserData[] = [];
    const userId = 'userId';

    mount(<TestComponent pendingUsers={pendingUsers} users={users} userId={userId} />);
  });

  it('should return an empty pending player when no pending players are present', () => {
    const pendingUsers: GameUserData[] = [];
    const users: GameUserData[] = [];
    const userId = 'userId';

    const wrapper = mount(<TestComponent pendingUsers={pendingUsers} users={users} userId={userId} />);

    const {
      hook: { pendingUser },
    } = wrapper.find(Div).props();

    const expectedPendingUser = { id: '', name: '' };
    expect(pendingUser).toEqual(expectedPendingUser);
  });

  it('should return a player name and id when a pending player is present and the current user is a game user', async () => {
    const testPlayer = { id: 'playerId', item: { id: 'playerId', username: 'playerName', avatar: 'testAvatar' } };
    const pendingUsers: GameUserData[] = [testPlayer];
    const users: GameUserData[] = [{ id: 'userId' }];
    const userId = 'userId';

    const wrapper = mount(<TestComponent pendingUsers={pendingUsers} users={users} userId={userId} />);

    const {
      hook: { pendingUser },
    } = wrapper.find(Div).props();

    const expectedPendingUser = { id: testPlayer.id, name: testPlayer.item.username };
    expect(pendingUser).toEqual(expectedPendingUser);
  });

  it('should not return any pending player when a pending player is present but the current user is not a game user', async () => {
    const testPlayer = { id: 'playerId', item: { id: 'playerId', username: 'playerName', avatar: 'testAvatar' } };
    const pendingUsers: GameUserData[] = [testPlayer];
    const users: GameUserData[] = [{ id: 'anotherUserId' }];
    const userId = 'userId';

    const wrapper = mount(<TestComponent pendingUsers={pendingUsers} users={users} userId={userId} />);

    const {
      hook: { pendingUser },
    } = wrapper.find(Div).props();

    const expectedPendingUser = { id: '', name: '' };
    expect(pendingUser).toEqual(expectedPendingUser);
  });

  // it('should allow the user to dismiss the current pending player', async () => {
  //   const testPlayer = { id: 'playerId', item: { id: 'playerId', username: 'playerName', avatar: 'testAvatar' } };
  //   const pendingUsers: GameUserData[] = [testPlayer];
  //   const users: GameUserData[] = [{ id: 'userId' }];
  //   const userId = 'userId';

  //   const wrapper = mount(<TestComponent pendingUsers={pendingUsers} users={users} userId={userId} />);

  //   const {
  //     hook: { dismissPendingPlayer },
  //   } = wrapper.find(Div).props();

  //   await act(async () => {
  //     await dismissPendingPlayer([testPlayer.id]);
  //   });

  //   wrapper.update();

  //   const {
  //     hook: { pendingUser },
  //   } = wrapper.find(Div).props();

  //   const expectedPendingUser = { id: '', name: '' };
  //   expect(pendingUser).toEqual(expectedPendingUser);
  // });

  // it('should return the next pending player after the first gets dismissed', async () => {
  //   const testPlayer1 = { id: 'player1', item: { id: 'player1', username: 'playerName1', avatar: 'testAvatar1' } };
  //   const testPlayer2 = { id: 'player2', item: { id: 'player2', username: 'playerName2', avatar: 'testAvatar2' } };
  //   const pendingUsers: GameUserData[] = [testPlayer1, testPlayer2];
  //   const users: GameUserData[] = [{ id: 'userId' }];
  //   const userId = 'userId';

  //   const wrapper = mount(<TestComponent pendingUsers={pendingUsers} users={users} userId={userId} />);

  //   const {
  //     hook: { dismissPendingPlayer },
  //   } = wrapper.find(Div).props();

  //   await act(async () => {
  //     await dismissPendingPlayer([testPlayer1.id]);
  //   });

  //   wrapper.update();

  //   const {
  //     hook: { pendingUser },
  //   } = wrapper.find(Div).props();

  //   const expectedPendingUser = { id: testPlayer2.id, name: testPlayer2.item.username };
  //   expect(pendingUser).toEqual(expectedPendingUser);
  // });

  // it('should return a list of dismissed pending players', async () => {
  //   const testPlayer1 = { id: 'player1', item: { id: 'player1', username: 'playerName1', avatar: 'testAvatar1' } };
  //   const testPlayer2 = { id: 'player2', item: { id: 'player2', username: 'playerName2', avatar: 'testAvatar2' } };
  //   const pendingUsers: GameUserData[] = [testPlayer1, testPlayer2];
  //   const users: GameUserData[] = [{ id: 'userId' }];
  //   const userId = 'userId';

  //   const wrapper = mount(<TestComponent pendingUsers={pendingUsers} users={users} userId={userId} />);

  //   const {
  //     hook: { dismissPendingPlayer },
  //   } = wrapper.find(Div).props();

  //   await act(async () => {
  //     await dismissPendingPlayer([testPlayer1.id]);
  //   });

  //   wrapper.update();

  //   const {
  //     hook: { dismissedPendingPlayers },
  //   } = wrapper.find(Div).props();

  //   expect(dismissedPendingPlayers).toEqual([testPlayer1.id]);
  // });

  it('should return "isPendingUser" equal to "false" when the current user is not pending', async () => {
    const pendingUsers: GameUserData[] = [];
    const users: GameUserData[] = [{ id: 'userId' }];
    const userId = 'player';

    const wrapper = mount(<TestComponent pendingUsers={pendingUsers} users={users} userId={userId} />);

    const {
      hook: { isPendingUser },
    } = wrapper.find(Div).props();

    const res = isPendingUser();

    expect(res).toBe(false);
  });

  it('should return "isPendingUser" equal to "true" when the current user is pending', async () => {
    const testPlayer = { id: 'player', item: { id: 'player', username: 'playerName', avatar: 'testAvatar' } };
    const pendingUsers: GameUserData[] = [testPlayer];
    const users: GameUserData[] = [{ id: 'userId' }];
    const userId = 'player';

    const wrapper = mount(<TestComponent pendingUsers={pendingUsers} users={users} userId={userId} />);

    const {
      hook: { isPendingUser },
    } = wrapper.find(Div).props();

    const res = isPendingUser();

    expect(res).toBe(true);
  });

  it('should return "isAcceptedUser" equal to "false" when the current user is not a game user', async () => {
    const pendingUsers: GameUserData[] = [];
    const users: GameUserData[] = [{ id: 'userId' }];
    const userId = 'player';

    const wrapper = mount(<TestComponent pendingUsers={pendingUsers} users={users} userId={userId} />);

    const {
      hook: { isAcceptedUser },
    } = wrapper.find(Div).props();

    const res = isAcceptedUser(userId);

    expect(res).toBe(false);
  });

  it('should return "isAcceptedUser" equal to "true" when the current user is a game user', async () => {
    const pendingUsers: GameUserData[] = [];
    const users: GameUserData[] = [{ id: 'player' }];
    const userId = 'player';

    const wrapper = mount(<TestComponent pendingUsers={pendingUsers} users={users} userId={userId} />);

    const {
      hook: { isAcceptedUser },
    } = wrapper.find(Div).props();

    const res = isAcceptedUser(userId);

    expect(res).toBe(true);
  });
});
