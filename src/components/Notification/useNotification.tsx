import { useRef, useCallback } from 'react';
import { NotificationVariant } from './Notification';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Resolvers } from 'apollo-boost';

interface OpenNotificationInput {
  openNotificationInput: {
    openStatus: boolean;
    variant: NotificationVariant;
    message: string;
  };
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

const OPEN_NOTIFICATION = gql`
  mutation OpenNotification($openNotificationInput: OpenNotificationInput!) {
    openNotification(openNotificationInput: $openNotificationInput) @client
  }
`;

const resolvers: Resolvers = {
  Mutation: {
    async openNotification(_, { openNotificationInput }: OpenNotificationInput, { cache, getCacheKey }) {
      const { openStatus, message, variant } = openNotificationInput;
      const currState = cache.readQuery({ query: GET_NOTIFICATION });

      cache.writeData({
        data: {
          notification: {
            ...currState.notification,
            message: message || '',
            variant: variant || 'info',
            open: openStatus,
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
  const [_openNotification] = useMutation(OPEN_NOTIFICATION);
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

  const openNotification = useCallback(
    (_message: string, _variant: NotificationVariant = 'info') => {
      if (!_message) {
        return;
      }

      const tryToShowNotification = () => {
        if (notificationTimeout.current) {
          clearTimeout(notificationTimeout.current);
          notificationTimeout.current = undefined;

          setTimeout(() => {
            _openNotification({
              variables: {
                openNotificationInput: {
                  message: '',
                  openStatus: false,
                },
              },
            });
          }, 150);
          setTimeout(() => tryToShowNotification(), 750);
          return;
        }

        _openNotification({
          variables: {
            openNotificationInput: {
              message: _message,
              variant: _variant,
              openStatus: true,
            },
          },
        });

        if (!notificationTimeout.current) {
          notificationTimeout.current = setTimeout(() => {
            _openNotification({
              variables: {
                openNotificationInput: {
                  message: '',
                  openStatus: false,
                  variant: 'info',
                },
              },
            });

            if (notificationTimeout.current) {
              clearTimeout(notificationTimeout.current);
              notificationTimeout.current = undefined;
            }
          }, timeout);
        }
      };

      return tryToShowNotification();
    },
    [timeout, _openNotification]
  );

  const dismissNotification = () => {
    _openNotification({
      variables: {
        openNotificationInput: {
          message: '',
          openStatus: false,
        },
      },
    });
  };

  return {
    open,
    message,
    variant,
    openNotification,
    dismissNotification,
  };
};
