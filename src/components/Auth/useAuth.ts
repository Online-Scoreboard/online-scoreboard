import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { Resolvers } from 'apollo-boost';
import gql from 'graphql-tag';
import { awsSignIn, awsSignOut, getCurrentUser } from './AWS';
import { DEFAULT_ERROR_MESSAGE, LOGIN_WELCOME_MESSAGE } from '../../helpers/strings';

const GET_USER = gql`
  query GetUser {
    user @client(always: true) {
      isLoggedIn
      username
      email
      error
    }
  }
`;

const RESET_ERRORS = gql`
  mutation ResetErrors {
    resetErrors @client
  }
`;

const LOG_IN = gql`
  mutation LogIn($loginData: LogInData!) {
    logIn(loginData: $loginData) @client
  }
`;

const LOG_OUT = gql`
  mutation LogOut {
    logOut @client
  }
`;

interface User {
  attributes: {
    email: string;
    email_verified: boolean;
  };
  username: string;
}

interface UserData {
  __typename: string;
  isLoggedIn: boolean;
  username: string;
  email: string;
  error: string;
}

const resolvers: Resolvers = {
  Query: {
    async user(_, __, { cache }) {
      const data: UserData = {
        __typename: 'UserSession',
        isLoggedIn: false,
        username: '',
        email: '',
        error: '',
      };

      let user: User | void = undefined;
      try {
        user = await getCurrentUser();
      } catch (err) {
        data.error = err.message || DEFAULT_ERROR_MESSAGE;
      }

      if (user) {
        data.isLoggedIn = true;
        data.username = user.username;
        data.email = user.attributes.email;
      }

      cache.writeData({ data });
      return data;
    },
  },

  Mutation: {
    async resetErrors(_, __, { cache }): Promise<void> {
      const currState = cache.readQuery({ query: GET_USER });
      const userData: UserData = { ...currState.user };

      userData.error = '';
      cache.writeData({ data: { user: userData } });
    },

    async logIn(launch, { loginData }, { cache }): Promise<void> {
      const currState = cache.readQuery({ query: GET_USER });
      const userData: UserData = { ...currState.user };

      let user: User | void = undefined;
      try {
        await awsSignIn(loginData.username, loginData.password);
        user = await getCurrentUser();
      } catch (err) {
        userData.isLoggedIn = false;
        userData.error = err.message || DEFAULT_ERROR_MESSAGE;

        cache.writeData({ data: { user: userData } });
        return;
      }

      userData.error = '';

      if (user) {
        userData.isLoggedIn = true;
        userData.username = user.username;
        userData.email = user.attributes.email;
      }

      cache.writeData({ data: { user: userData } });
    },

    async logOut(launch, args, { cache }): Promise<void> {
      const currState = cache.readQuery({ query: GET_USER });
      const userData: UserData = { ...currState.user };

      // throw new Error('Ops');
      try {
        await awsSignOut();
      } catch (err) {
        userData.error = err.message || DEFAULT_ERROR_MESSAGE;
        cache.writeData({ data: { user: userData } });
        return;
      }

      userData.isLoggedIn = false;
      userData.username = '';
      userData.email = '';
      userData.error = '';

      cache.writeData({ data: { user: userData } });
    },
  },
};

export const useAuth = () => {
  const client = useApolloClient();
  client.addResolvers(resolvers);

  const { loading: userLoading, data } = useQuery<{ user: UserData }>(GET_USER);
  const [logOut, { loading: logOutLoading }] = useMutation<void>(LOG_OUT);
  const [logIn, { loading: logInLoading }] = useMutation<void>(LOG_IN);
  const [resetErrors] = useMutation<void>(RESET_ERRORS);

  const user = data && data.user;

  const isLoggedIn = Boolean(user && user.isLoggedIn);
  const success = isLoggedIn && LOGIN_WELCOME_MESSAGE;

  return {
    user,
    isLoggedIn,
    loading: userLoading,
    operationLoading: logInLoading || logOutLoading,
    error: user && user.error,
    success,
    logIn: async (username: string, password: string) => {
      await resetErrors();
      await logIn({ variables: { loginData: { username, password } } });
    },
    logOut: async () => {
      await resetErrors();
      await logOut();
    },
  };
};
