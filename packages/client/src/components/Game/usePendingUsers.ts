import { useState, useEffect, useCallback } from 'react';
import { GameUserData } from './Game.types';

export const usePendingUsers = (pendingUsers: GameUserData[] = [], users: GameUserData[], userId: string) => {
  const [pendingUser, setPendingUser] = useState({ id: '', name: '' });

  const isAcceptedUser = useCallback(
    (user = '') => {
      return Boolean(users.find(currUser => currUser && currUser.id === user));
    },
    [users]
  );

  const isPendingUser = useCallback(() => {
    const isPending = pendingUsers.find(currPendingUser => currPendingUser.id === userId);

    return Boolean(isPending);
  }, [pendingUsers, userId]);

  useEffect(() => {
    if (pendingUsers) {
      if (
        pendingUser.id &&
        pendingUsers &&
        !pendingUsers.find(currPendingUser => currPendingUser.id === pendingUser.id)
      ) {
        setPendingUser({ id: '', name: '' });
      }
    } else {
      setPendingUser({ id: '', name: '' });
    }
  }, [pendingUser.id, pendingUsers]);

  useEffect(() => {
    if (isAcceptedUser(userId) && pendingUsers.length) {
      const { id, item } = pendingUsers[0];

      if (item && item.username) {
        setPendingUser({
          id,
          name: item.username,
        });
      }
    } else if (pendingUser.id) {
      setPendingUser({ id: '', name: '' });
    }
  }, [isAcceptedUser, pendingUser.id, pendingUsers, pendingUsers.length, userId]);

  return {
    pendingUser,
    isAcceptedUser,
    isPendingUser,
  };
};
