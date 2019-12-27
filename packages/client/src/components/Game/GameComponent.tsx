import React, { memo } from 'react';

interface Game {
  users: string[];
}

interface Props {
  game: Game;
}

const Component: React.FC<Props> = ({ game }) => {
  if (!game) {
    return null;
  }

  return (
    <div>
      <p>user connected:</p>
      <ul>
        {game.users &&
          game.users.map(user => {
            return <li key={user}>{user}</li>;
          })}
      </ul>
    </div>
  );
};

export const GameComponent = memo(Component);
