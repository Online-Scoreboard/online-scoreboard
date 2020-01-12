import gql from 'graphql-tag';
import { useCallback } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { Resolvers } from 'apollo-client';
import { createHook } from 'hookleton';
import { NotificationVariant } from '../../components/Notification';

interface MessageData {
  message: {
    body: string;
    variant: NotificationVariant;
    __typename: string;
  };
}

export const messageInitialState: MessageData = {
  message: {
    body: '',
    variant: 'info',
    __typename: 'Message',
  },
};

interface MessageInput {
  messageInput: {
    variant: NotificationVariant;
    body: string;
  };
}

const GET_MESSAGE = gql`
  query GetMessage {
    message @client {
      body
      variant
    }
  }
`;

export const CLEAR_MESSAGE = gql`
  mutation clearMessage {
    clearMessage @client
  }
`;

const CREATE_MESSAGE = gql`
  mutation CreateMessage($messageInput: MessageInput!) {
    createMessage(messageInput: $messageInput) @client
  }
`;

const resolvers: Resolvers = {
  Mutation: {
    async clearMessage(_, __, { cache }) {
      const currState = cache.readQuery({ query: GET_MESSAGE });

      cache.writeData({
        data: {
          message: {
            ...currState.message,
            body: '',
          },
        },
      });

      return null;
    },

    async createMessage(_, { messageInput }: MessageInput, { cache }) {
      const { body, variant } = messageInput;
      const currState = cache.readQuery({ query: GET_MESSAGE });

      cache.writeData({
        data: {
          message: {
            ...currState.message,
            body: `${body}`,
            variant,
          },
        },
      });

      return null;
    },
  },
};

interface Hook {
  use: () => any;
  (): {
    body: string;
    createMessage: (message: string, variant?: NotificationVariant) => Promise<void>;
    clearMessage: () => void;
    variant: NotificationVariant;
  };
}

const useMessageHook = () => {
  const client = useApolloClient();
  client.addResolvers(resolvers);

  const { data } = useQuery<MessageData>(GET_MESSAGE);
  const [_createMessage] = useMutation<void, MessageInput>(CREATE_MESSAGE);
  const [_clearMessage] = useMutation<void>(CLEAR_MESSAGE);

  const defaultMessage: MessageData = {
    message: {
      body: '',
      variant: 'info',
      __typename: 'Message',
    },
  };

  const notification = (data && data.message) || defaultMessage.message;
  const { body, variant } = notification;

  const clearMessage = useCallback(() => {
    _clearMessage();
  }, [_clearMessage]);

  const createMessage = useCallback(
    async (_message: string, _variant: NotificationVariant = 'info') => {
      if (!_message) {
        return;
      }

      await clearMessage();

      _createMessage({
        variables: {
          messageInput: { body: _message, variant: _variant },
        },
      });
    },
    [_createMessage, clearMessage]
  );

  return {
    body,
    variant,
    createMessage,
    clearMessage,
  };
};

export const useMessage: Hook = createHook(useMessageHook);

// Message Context provider
export const MessageHost = () => {
  useMessage.use();
  return null;
};
