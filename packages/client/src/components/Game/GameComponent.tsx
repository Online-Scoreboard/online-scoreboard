import React, { memo } from 'react';

const Component: React.FC = () => {
  return <p>Allo</p>;
};

export const GameComponent = memo(Component);
