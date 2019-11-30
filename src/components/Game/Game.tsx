import React, { memo } from 'react';
import { RouteComponentProps } from '@reach/router';

interface GameProps extends RouteComponentProps {
  gameId?: string;
}

const Component: React.FC<GameProps> = ({ gameId }) => <div>Game Id: {gameId}</div>;

export const Game = memo(Component);
