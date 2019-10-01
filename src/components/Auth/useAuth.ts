import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { Resolvers } from 'apollo-boost';
import gql from 'graphql-tag';

import {
  awsSignIn,
  awsSignOut,
  awsRegister,
  getCurrentUser,
  awsVerifyEmail,
  awsResendCode,
  awsResetPassword,
} from './AWS';
import { DEFAULT_ERROR_MESSAGE, LOGIN_WELCOME_MESSAGE } from '../../helpers/strings';

const GET_USER = gql`
  query GetUser {
    user @client(always: true) {
      isLoggedIn
      confirmEmail
      username
      email
      error
      info
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

const REGISTER = gql`
  mutation Register($registerData: RegisterData!) {
    register(registerData: $registerData) @client
  }
`;

const VERIFY_EMAIL = gql`
  mutation VerifyEmail($verifyEmailData: VerifyEmailData!) {
    verifyEmail(verifyEmailData: $verifyEmailData) @client
  }
`;

const RESEND_CODE = gql`
  mutation ResendCode {
    resendCode @client
  }
`;

const RESET_PASSWORD = gql`
  mutation ResetPassword($resetPasswordData: ResetPasswordData!) {
    resetPassword(resetPasswordData: $resetPasswordData) @client
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
  confirmEmail: boolean;
  username: string;
  email: string;
  error: string;
  info: string;
}

const resolvers: Resolvers = {
  Query: {
    async user(parent) {
      const currUser = parent.user;

      const data: UserData = {
        __typename: 'UserSession',
        isLoggedIn: false,
        confirmEmail: false,
        username: '',
        email: '',
        error: '',
        info: '',
        ...currUser,
      };

      let user: User | void = undefined;
      try {
        user = await getCurrentUser();
      } catch (err) {
        data.error = err.message || DEFAULT_ERROR_MESSAGE;
      }

      if (user) {
        data.isLoggedIn = true;
        data.confirmEmail = false;
        data.username = user.username;
        data.email = user.attributes.email;
      }

      return data;
    },
  },

  Mutation: {
    async resetErrors(_, __, { cache }): Promise<void> {
      const currState = cache.readQuery({ query: GET_USER });
      const userData: UserData = { ...currState.user };

      userData.error = '';
      userData.info = '';
      cache.writeData({ data: { user: userData } });
    },

    async logIn(_, { loginData }, { cache }): Promise<void> {
      const currState = cache.readQuery({ query: GET_USER });
      const userData: UserData = { ...currState.user };

      userData.error = '';
      userData.info = '';

      let user: User | void = undefined;
      try {
        await awsSignIn(loginData.username, loginData.password);
        user = await getCurrentUser();
      } catch (err) {
        if (err && err.code === 'UserNotConfirmedException') {
          userData.confirmEmail = true;
          userData.email = loginData.username;
        } else {
          userData.confirmEmail = false;
        }

        userData.isLoggedIn = false;
        userData.error = err.message || DEFAULT_ERROR_MESSAGE;

        cache.writeData({ data: { user: userData } });
        return;
      }

      if (user) {
        userData.isLoggedIn = true;
        userData.confirmEmail = false;
        userData.username = user.username;
        userData.email = user.attributes.email;
      }

      cache.writeData({ data: { user: userData } });
    },

    async register(_, { registerData }, { cache }): Promise<void> {
      const currState = cache.readQuery({ query: GET_USER });
      const userData: UserData = { ...currState.user };

      userData.error = '';
      userData.info = '';

      let res: any;
      try {
        res = await awsRegister(registerData.username, registerData.password);
      } catch (err) {
        userData.error = err.message || DEFAULT_ERROR_MESSAGE;
        cache.writeData({ data: { user: userData } });
        return;
      }

      if (!(res && res.userSub)) {
        userData.error = DEFAULT_ERROR_MESSAGE;
      }

      if (res && res.userConfirmed === false) {
        userData.confirmEmail = true;
        userData.email = registerData.username;
      }

      cache.writeData({ data: { user: userData } });
    },

    async verifyEmail(_, { verifyEmailData }, { cache }): Promise<void> {
      const currState = cache.readQuery({ query: GET_USER });
      const userData: UserData = { ...currState.user };
      const { code } = verifyEmailData;

      userData.error = '';
      userData.info = '';

      try {
        await awsVerifyEmail(userData.email, code);
      } catch (err) {
        userData.error = err.message || DEFAULT_ERROR_MESSAGE;
        cache.writeData({ data: { user: userData } });
        return;
      }

      userData.confirmEmail = false;
      userData.info = 'User correctly verified. You can now log in';

      cache.writeData({ data: { user: userData } });
    },

    async resendCode(_, __, { cache }): Promise<void> {
      const currState = cache.readQuery({ query: GET_USER });
      const userData: UserData = { ...currState.user };

      userData.error = '';
      userData.info = '';

      try {
        await awsResendCode(userData.email);
      } catch (err) {
        userData.error = (err.message && err.message.trim()) || DEFAULT_ERROR_MESSAGE;
        cache.writeData({ data: { user: userData } });
        return;
      }

      userData.info = `New code correctly sent to ${userData.email}`;
      cache.writeData({ data: { user: userData } });
    },

    async resetPassword(_, { resetPasswordData }, { cache }): Promise<void> {
      const currState = cache.readQuery({ query: GET_USER });
      const userData: UserData = { ...currState.user };
      const { email } = resetPasswordData;

      userData.error = '';
      userData.info = '';

      try {
        await awsResetPassword(email);
      } catch (err) {
        userData.error = (err.message && err.message.trim()) || DEFAULT_ERROR_MESSAGE;
        cache.writeData({ data: { user: userData } });
        return;
      }

      userData.info = `Reset password code correctly sent to ${email}`;
      cache.writeData({ data: { user: userData } });
    },

    async logOut(_, __, { cache }): Promise<void> {
      const currState = cache.readQuery({ query: GET_USER });
      const userData: UserData = { ...currState.user };

      try {
        await awsSignOut();
      } catch (err) {
        userData.error = err.message || DEFAULT_ERROR_MESSAGE;
        cache.writeData({ data: { user: userData } });
        return;
      }

      userData.isLoggedIn = false;
      userData.confirmEmail = false;
      userData.username = '';
      userData.email = '';
      userData.error = '';
      userData.info = 'You are now logged out';

      cache.writeData({ data: { user: userData } });
    },
  },
};

export const useAuth = () => {
  const client = useApolloClient();
  client.addResolvers(resolvers);

  const { loading: userLoading, data } = useQuery<{ user: UserData }>(GET_USER);
  const [_logOut, { loading: logOutLoading }] = useMutation<void>(LOG_OUT);
  const [_logIn, { loading: logInLoading }] = useMutation<void>(LOG_IN);
  const [_register, { loading: registerLoading }] = useMutation<void>(REGISTER);
  const [_verifyEmail, { loading: verifyEmailLoading }] = useMutation<void>(VERIFY_EMAIL);
  const [_resendCode, { loading: resendCodeLoading }] = useMutation<void>(RESEND_CODE);
  const [_forgottenPassword, { loading: forgottenPasswordLoading }] = useMutation<void>(RESET_PASSWORD);
  const [resetErrors] = useMutation<void>(RESET_ERRORS);

  const user = data && data.user;

  const isLoggedIn = Boolean(user && user.isLoggedIn);
  const confirmEmail = Boolean(user && user.confirmEmail);
  const success = isLoggedIn && LOGIN_WELCOME_MESSAGE;

  return {
    user,
    isLoggedIn,
    confirmEmail,
    loading: userLoading,
    operationLoading:
      logInLoading ||
      logOutLoading ||
      registerLoading ||
      verifyEmailLoading ||
      resendCodeLoading ||
      forgottenPasswordLoading,
    error: user && user.error,
    info: user && user.info,
    success,
    logIn: async (username: string, password: string) => {
      await resetErrors();
      return _logIn({ variables: { loginData: { username, password } } });
    },
    register: async (username: string, password: string) => {
      await resetErrors();
      return _register({ variables: { registerData: { username, password } } });
    },
    verifyEmail: async (code: string) => {
      await resetErrors();
      return _verifyEmail({ variables: { verifyEmailData: { code } } });
    },
    resendCode: async () => {
      await resetErrors();
      return _resendCode();
    },
    logOut: async () => {
      await resetErrors();
      return _logOut();
    },
    forgottenPassword: async (email: string) => {
      await resetErrors();
      return _forgottenPassword({ variables: { resetPasswordData: { email } } });
    },
  };
};
