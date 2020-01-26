import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { usePendingPlayers } from './usePendingPlayers';
import { GameUserData } from './Game.types';

describe(' usePendingPlayers', () => {
  interface DivProps {
    hook: any;
  }

  const Div: React.FC<DivProps> = () => <div />;

  interface TestComponentProps {
    pendingPlayers: GameUserData[];
    users: GameUserData[];
    userId: string;
  }

  const TestComponent: React.FC<TestComponentProps> = ({ pendingPlayers, users, userId }) => {
    const pendingPlayersHook = usePendingPlayers(pendingPlayers, users, userId);
    return <Div hook={pendingPlayersHook} />;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a usePendingPlayers hook without crashing', () => {
    const pendingPlayers: GameUserData[] = [];
    const users: GameUserData[] = [];
    const userId = 'userId';

    mount(<TestComponent pendingPlayers={pendingPlayers} users={users} userId={userId} />);
  });

  it('should return an empty pending player when no pending players are present', () => {
    const pendingPlayers: GameUserData[] = [];
    const users: GameUserData[] = [];
    const userId = 'userId';

    const wrapper = mount(<TestComponent pendingPlayers={pendingPlayers} users={users} userId={userId} />);

    const {
      hook: { pendingPlayer },
    } = wrapper.find(Div).props();

    const expectedPendingPlayer = { id: '', name: '' };
    expect(pendingPlayer).toEqual(expectedPendingPlayer);
  });

  it('should return a player name and id when a pending player is present and the current user is a game user', async () => {
    const testPlayer = { id: 'playerId', item: { id: 'playerId', username: 'playerName', avatar: 'testAvatar' } };
    const pendingPlayers: GameUserData[] = [testPlayer];
    const users: GameUserData[] = [{ id: 'userId' }];
    const userId = 'userId';

    const wrapper = mount(<TestComponent pendingPlayers={pendingPlayers} users={users} userId={userId} />);

    const {
      hook: { pendingPlayer },
    } = wrapper.find(Div).props();

    const expectedPendingPlayer = { id: testPlayer.id, name: testPlayer.item.username };
    expect(pendingPlayer).toEqual(expectedPendingPlayer);
  });

  it('should not return any pending player when a pending player is present but the current user is not a game user', async () => {
    const testPlayer = { id: 'playerId', item: { id: 'playerId', username: 'playerName', avatar: 'testAvatar' } };
    const pendingPlayers: GameUserData[] = [testPlayer];
    const users: GameUserData[] = [{ id: 'anotherUserId' }];
    const userId = 'userId';

    const wrapper = mount(<TestComponent pendingPlayers={pendingPlayers} users={users} userId={userId} />);

    const {
      hook: { pendingPlayer },
    } = wrapper.find(Div).props();

    const expectedPendingPlayer = { id: '', name: '' };
    expect(pendingPlayer).toEqual(expectedPendingPlayer);
  });

  it('should allow the user to dismiss the current pending player', async () => {
    const testPlayer = { id: 'playerId', item: { id: 'playerId', username: 'playerName', avatar: 'testAvatar' } };
    const pendingPlayers: GameUserData[] = [testPlayer];
    const users: GameUserData[] = [{ id: 'userId' }];
    const userId = 'userId';

    const wrapper = mount(<TestComponent pendingPlayers={pendingPlayers} users={users} userId={userId} />);

    const {
      hook: { dismissPendingPlayer },
    } = wrapper.find(Div).props();

    await act(async () => {
      await dismissPendingPlayer([testPlayer.id]);
    });

    wrapper.update();

    const {
      hook: { pendingPlayer },
    } = wrapper.find(Div).props();

    const expectedPendingPlayer = { id: '', name: '' };
    expect(pendingPlayer).toEqual(expectedPendingPlayer);
  });

  it('should return the next pending player after the first gets dismissed', async () => {
    const testPlayer1 = { id: 'player1', item: { id: 'player1', username: 'playerName1', avatar: 'testAvatar1' } };
    const testPlayer2 = { id: 'player2', item: { id: 'player2', username: 'playerName2', avatar: 'testAvatar2' } };
    const pendingPlayers: GameUserData[] = [testPlayer1, testPlayer2];
    const users: GameUserData[] = [{ id: 'userId' }];
    const userId = 'userId';

    const wrapper = mount(<TestComponent pendingPlayers={pendingPlayers} users={users} userId={userId} />);

    const {
      hook: { dismissPendingPlayer },
    } = wrapper.find(Div).props();

    await act(async () => {
      await dismissPendingPlayer([testPlayer1.id]);
    });

    wrapper.update();

    const {
      hook: { pendingPlayer },
    } = wrapper.find(Div).props();

    const expectedPendingPlayer = { id: testPlayer2.id, name: testPlayer2.item.username };
    expect(pendingPlayer).toEqual(expectedPendingPlayer);
  });

  it('should return a list of dismissed pending players', async () => {
    const testPlayer1 = { id: 'player1', item: { id: 'player1', username: 'playerName1', avatar: 'testAvatar1' } };
    const testPlayer2 = { id: 'player2', item: { id: 'player2', username: 'playerName2', avatar: 'testAvatar2' } };
    const pendingPlayers: GameUserData[] = [testPlayer1, testPlayer2];
    const users: GameUserData[] = [{ id: 'userId' }];
    const userId = 'userId';

    const wrapper = mount(<TestComponent pendingPlayers={pendingPlayers} users={users} userId={userId} />);

    const {
      hook: { dismissPendingPlayer },
    } = wrapper.find(Div).props();

    await act(async () => {
      await dismissPendingPlayer([testPlayer1.id]);
    });

    wrapper.update();

    const {
      hook: { dismissedPendingPlayers },
    } = wrapper.find(Div).props();

    expect(dismissedPendingPlayers).toEqual([testPlayer1.id]);
  });

  it('should return "isPendingUser" equal to "false" when the current user is not pending', async () => {
    const pendingPlayers: GameUserData[] = [];
    const users: GameUserData[] = [{ id: 'userId' }];
    const userId = 'player';

    const wrapper = mount(<TestComponent pendingPlayers={pendingPlayers} users={users} userId={userId} />);

    const {
      hook: { isPendingUser },
    } = wrapper.find(Div).props();

    const res = isPendingUser();

    expect(res).toBe(false);
  });

  it('should return "isPendingUser" equal to "true" when the current user is pending', async () => {
    const testPlayer = { id: 'player', item: { id: 'player', username: 'playerName', avatar: 'testAvatar' } };
    const pendingPlayers: GameUserData[] = [testPlayer];
    const users: GameUserData[] = [{ id: 'userId' }];
    const userId = 'player';

    const wrapper = mount(<TestComponent pendingPlayers={pendingPlayers} users={users} userId={userId} />);

    const {
      hook: { isPendingUser },
    } = wrapper.find(Div).props();

    const res = isPendingUser();

    expect(res).toBe(true);
  });

  it('should return "isAcceptedUser" equal to "false" when the current user is not a game user', async () => {
    const pendingPlayers: GameUserData[] = [];
    const users: GameUserData[] = [{ id: 'userId' }];
    const userId = 'player';

    const wrapper = mount(<TestComponent pendingPlayers={pendingPlayers} users={users} userId={userId} />);

    const {
      hook: { isAcceptedUser },
    } = wrapper.find(Div).props();

    const res = isAcceptedUser();

    expect(res).toBe(false);
  });

  it('should return "isAcceptedUser" equal to "true" when the current user is a game user', async () => {
    const pendingPlayers: GameUserData[] = [];
    const users: GameUserData[] = [{ id: 'player' }];
    const userId = 'player';

    const wrapper = mount(<TestComponent pendingPlayers={pendingPlayers} users={users} userId={userId} />);

    const {
      hook: { isAcceptedUser },
    } = wrapper.find(Div).props();

    const res = isAcceptedUser();

    expect(res).toBe(true);
  });
});
