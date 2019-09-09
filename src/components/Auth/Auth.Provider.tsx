import { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Resolvers } from 'apollo-boost';

const GET_USER = gql`
  query GetUser {
    user @client(always: true) {
      isLoggedIn
      username
      email
    }
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
    sub: string;
  };
  username: string;
}

const resolvers: Resolvers = {
  Query: {
    async user(launch, args, { cache }): Promise<void> {
      console.warn('checking user');
      let user: User;
      const data = {
        user: {
          __typename: 'UserSession',
          isLoggedIn: false,
          username: '',
          email: '',
        },
      };
      try {
        user = await Auth.currentUserInfo();
        data.user.isLoggedIn = true;
        data.user.username = user.username;
        data.user.email = user.attributes.email;
      } catch (err) {
        data.user.isLoggedIn = false;
      }

      cache.writeData({ data });
    },
  },

  Mutation: {
    async logIn(launch, { loginData }, { cache }) {
      try {
        await awsSignIn(loginData.username, loginData.password);
      } catch (err) {
        console.error(err);
      }
    },

    async logOut(launch, args, { cache }) {
      try {
        await awsSignOut();
      } catch (err) {
        console.error(err);
      }

      const data = {
        user: {
          __typename: 'UserSession',
          isLoggedIn: false,
          username: '',
          email: '',
        },
      };

      cache.writeData({ data });
    },
  },
};

const awsSignIn = async (username: string, password: string) => {
  let res;
  try {
    res = await Auth.signIn(username, password);
  } catch (err) {
    if (err && err.code === 'UserNotConfirmedException') {
      //   type: SIGN_IN_CODE_CONFIRMATION,
      //   payload: data.username,
    }
    if (err && err.message) {
      console.error(err.message);
      throw new Error(err.message);
    } else {
      console.error('Something went wrong. Please try again later.');
      throw new Error('Something went wrong. Please try again later.');
    }
  }
  return res;
};

const awsSignOut = () => Auth.signOut();

export const useAuth = () => {
  const client = useApolloClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { loading: userLoading, error, data } = useQuery(GET_USER);
  const [logOut, { loading: logOutLoading }] = useMutation(LOG_OUT, {
    refetchQueries: ['GetUser'],
  });
  const [logIn, { loading: logInLoading }] = useMutation(LOG_IN, {
    refetchQueries: ['GetUser'],
  });

  client.addResolvers(resolvers);

  const user = data && data.user;

  useEffect(() => {
    if (user && user.isLoggedIn) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [logIn, logOut, user]);

  return {
    user,
    isLoggedIn,
    loading: userLoading,
    operationLoading: logInLoading || logOutLoading,
    logIn: (username: string, password: string) => {
      logIn({ variables: { loginData: { username, password } } });
    },
    logOut: () => logOut(),
  };
};
