import { useState } from 'react';
import { createHook } from 'hookleton';

interface Hook {
  use: () => any;
  (): {
    staticMessage: string;
    setStaticMessage: (message: string) => void;
  };
}

const useMessageHook = () => {
  const [staticMessage, setStaticMessage] = useState('');

  return {
    staticMessage,
    setStaticMessage,
  };
};

export const useStaticMessage: Hook = createHook(useMessageHook);

// StaticMessage Context provider
export const StaticMessageHost = () => {
  useStaticMessage.use();
  return null;
};
