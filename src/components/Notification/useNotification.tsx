import { useRef } from 'react';
import { NotificationVariant } from './Notification';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Resolvers } from 'apollo-boost';

interface SetOpenInput {
  openStatus: boolean;
}

interface SetVariantInput {
  variant: NotificationVariant;
}

interface SetMessageInput {
  message: string;
}

interface NotificationData {
  notification: {
    open: boolean;
    variant: NotificationVariant;
    message: string;
    __typename: string;
  };
}

export const notificationInitialData: NotificationData = {
  notification: {
    __typename: 'Notification',
    message: '',
    variant: 'info',
    open: false,
  },
};

const GET_NOTIFICATION = gql`
  query GetNotification {
    notification @client {
      message
      variant
      open
    }
  }
`;

const SET_OPEN = gql`
  mutation SetOpen($openStatus: Boolean!) {
    setOpen(openStatus: $openStatus) @client
  }
`;

const SET_MESSAGE = gql`
  mutation SetMessage($message: String!) {
    setMessage(message: $message) @client
  }
`;

const SET_VARIANT = gql`
  mutation SetVariant($variant: Variant!) {
    setVariant(variant: $variant) @client
  }
`;

const resolvers: Resolvers = {
  Mutation: {
    async setOpen(_, { openStatus }: SetOpenInput, { cache, getCacheKey }) {
      const currState = cache.readQuery({ query: GET_NOTIFICATION });

      cache.writeData({
        data: {
          notification: {
            ...currState.notification,
            open: openStatus,
          },
        },
      });

      return null;
    },

    async setMessage(_, { message }: SetMessageInput, { cache, getCacheKey }) {
      const currState = cache.readQuery({ query: GET_NOTIFICATION });

      cache.writeData({
        data: {
          notification: {
            ...currState.notification,
            message: message || '',
          },
        },
      });

      return null;
    },

    async setVariant(_, { variant }: SetVariantInput, { cache, getCacheKey }) {
      const currState = cache.readQuery({ query: GET_NOTIFICATION });

      cache.writeData({
        data: {
          notification: {
            ...currState.notification,
            variant: variant || 'info',
          },
        },
      });

      return null;
    },
  },
};

export const useNotification = (timeout: number = 4000) => {
  const client = useApolloClient();
  client.addResolvers(resolvers);

  const { data } = useQuery<NotificationData>(GET_NOTIFICATION);
  const [_setOpen] = useMutation(SET_OPEN);
  const [_setMessage] = useMutation(SET_MESSAGE);
  const [_setVariant] = useMutation(SET_VARIANT);
  let notificationTimeout = useRef<void | NodeJS.Timeout>();

  const defaultNotification: NotificationData = {
    notification: {
      __typename: 'Notification',
      message: '',
      variant: 'info',
      open: false,
    },
  };

  const notification = (data && data.notification) || defaultNotification.notification;
  const { open, message, variant } = notification;

  return {
    open,
    message,
    variant,
    setNotification: (_message: string, _variant: NotificationVariant) => {
      const tryToShowNotification = () => {
        if (notificationTimeout.current) {
          clearTimeout(notificationTimeout.current);
          notificationTimeout.current = undefined;

          setTimeout(() => {
            _setOpen({ variables: { openStatus: false } });
            _setMessage({ variables: { message: '' } });
          }, 150);
          setTimeout(() => tryToShowNotification(), 750);
          return;
        }

        _setVariant({ variables: { variant: _variant } });
        _setMessage({ variables: { message: _message } });
        _setOpen({ variables: { openStatus: true } });

        if (!notificationTimeout.current) {
          notificationTimeout.current = setTimeout(() => {
            _setOpen({ variables: { openStatus: false } });
            _setMessage({ variables: { message: '' } });
            _setVariant({ variables: { variant: 'info' } });
            if (notificationTimeout.current) {
              clearTimeout(notificationTimeout.current);
              notificationTimeout.current = undefined;
            }
          }, timeout);
        }
      };

      return tryToShowNotification();
    },
  };
};
