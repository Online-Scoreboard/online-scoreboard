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
  awsResetPasswordConfirm,
  AWSUser,
} from './AWS';
import { DEFAULT_ERROR_MESSAGE, LOGIN_WELCOME_MESSAGE } from '../../helpers/strings';
import { useEffect } from 'react';

interface UserSessionData {
  __typename: string;
  isLoggedIn: boolean;
  confirmEmail: boolean;
  resetPassword: boolean;
  username: string;
  email: string;
  error: string;
  info: string;
  avatar?: string;
}

interface UserData {
  avatar: string;
}

const GET_USER = gql`
  query GetUser {
    user @client {
      isLoggedIn
      confirmEmail
      resetPassword
      username
      email
      error
      info
    }
    whoAmI {
      avatar
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser {
    createUser {
      id
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

const FORGOTTEN_PASSWORD = gql`
  mutation ForgottenPassword($forgottenPasswordData: ForgottenPasswordData!) {
    forgottenPassword(forgottenPasswordData: $forgottenPasswordData) @client
  }
`;

const RESET_PASSWORD = gql`
  mutation ResetPassword($resetPasswordData: ResetPasswordData!) {
    resetPassword(resetPasswordData: $resetPasswordData) @client
  }
`;

const resolvers: Resolvers = {
  Query: {
    async user(parent) {
      const currUser = parent.user;

      const data: UserSessionData = {
        __typename: 'UserSession',
        isLoggedIn: false,
        confirmEmail: false,
        resetPassword: false,
        username: '',
        email: '',
        error: '',
        info: '',
        ...currUser,
      };

      let user: AWSUser | void = undefined;
      try {
        user = await getCurrentUser();
      } catch (err) {
        data.error = err.message || DEFAULT_ERROR_MESSAGE;
      }

      if (user) {
        data.isLoggedIn = true;
        data.confirmEmail = false;
        data.resetPassword = false;
        data.username = user.username;
        data.email = user.attributes.email;
      }

      return data;
    },
  },

  Mutation: {
    async resetErrors(_, __, { cache }): Promise<void> {
      const currState = cache.readQuery({ query: GET_USER });
      const userData: UserSessionData = { ...currState.user };

      userData.error = '';
      userData.info = '';
      cache.writeData({ data: { user: userData } });
    },

    async logIn(_, { loginData }, { cache }): Promise<void> {
      const currState = cache.readQuery({ query: GET_USER });
      const userData: UserSessionData = { ...currState.user };

      userData.error = '';
      userData.info = '';

      let user: AWSUser | void = undefined;
      try {
        await awsSignIn(loginData.username, loginData.password);
        user = await getCurrentUser();
      } catch (err) {
        if (err && err.message === 'User not verified') {
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
      const userData: UserSessionData = { ...currState.user };

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
      const userData: UserSessionData = { ...currState.user };
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
      const userData: UserSessionData = { ...currState.user };

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

    async forgottenPassword(_, { forgottenPasswordData }, { cache }): Promise<void> {
      const currState = cache.readQuery({ query: GET_USER });
      const userData: UserSessionData = { ...currState.user };
      const { email } = forgottenPasswordData;

      userData.resetPassword = false;

      try {
        await awsResetPassword(email);
      } catch (err) {
        userData.error = (err.message && err.message.trim()) || DEFAULT_ERROR_MESSAGE;
        cache.writeData({ data: { user: userData } });
        throw new Error(err);
      }

      userData.info = `Reset password code correctly sent to ${email}`;
      userData.resetPassword = true;
      cache.writeData({ data: { user: userData } });
    },

    async resetPassword(_, { resetPasswordData }, { cache }): Promise<void> {
      const currState = cache.readQuery({ query: GET_USER });
      const userData: UserSessionData = { ...currState.user };
      const { username, code, newPassword } = resetPasswordData;

      try {
        await awsResetPasswordConfirm(username, code, newPassword);
      } catch (err) {
        userData.error = (err.message && err.message.trim()) || DEFAULT_ERROR_MESSAGE;
        userData.resetPassword = true;
        cache.writeData({ data: { user: userData } });
        throw new Error(err);
      }

      userData.info = `Password correctly reset. Please log in`;
      userData.resetPassword = false;
      cache.writeData({ data: { user: userData } });
    },

    async logOut(_, __, { cache }): Promise<void> {
      const currState = cache.readQuery({ query: GET_USER });
      const userData: UserSessionData = { ...currState.user };

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

  const { loading: userLoading, data } = useQuery<{ user: UserSessionData; whoAmI: UserData }>(GET_USER);
  const [_logOut, { loading: logOutLoading }] = useMutation<void>(LOG_OUT);
  const [createUser, { loading: createUserLoading }] = useMutation<void>(CREATE_USER);
  const [_logIn, { loading: logInLoading }] = useMutation<void>(LOG_IN);
  const [_register, { loading: registerLoading }] = useMutation<void>(REGISTER);
  const [_verifyEmail, { loading: verifyEmailLoading }] = useMutation<void>(VERIFY_EMAIL);
  const [_resendCode, { loading: resendCodeLoading }] = useMutation<void>(RESEND_CODE);
  const [_forgottenPassword, { loading: forgottenPasswordLoading }] = useMutation<void>(FORGOTTEN_PASSWORD);
  const [_resetPassword, { loading: resetPasswordLoading }] = useMutation<void>(RESET_PASSWORD);
  const [resetErrors] = useMutation<void>(RESET_ERRORS);

  const user = data && data.user;
  const whoAmI = data && data.whoAmI;

  const isLoggedIn = Boolean(user && user.isLoggedIn);
  const confirmEmail = Boolean(user && user.confirmEmail);
  const showResetPassword = Boolean(user && user.resetPassword);
  const success = isLoggedIn && LOGIN_WELCOME_MESSAGE;

  useEffect(() => {
    if (user && isLoggedIn && (!whoAmI || !whoAmI.avatar)) {
      createUser();
    }
  }, [user, whoAmI, isLoggedIn, createUser]);

  return {
    user,
    isLoggedIn,
    confirmEmail,
    showResetPassword,
    loading: userLoading,
    operationLoading:
      logInLoading ||
      createUserLoading ||
      logOutLoading ||
      registerLoading ||
      verifyEmailLoading ||
      resendCodeLoading ||
      resetPasswordLoading ||
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
      return _forgottenPassword({ variables: { forgottenPasswordData: { email } } });
    },
    resetPassword: async (username: string, code: string, newPassword: string) => {
      await resetErrors();
      return _resetPassword({ variables: { resetPasswordData: { username, code, newPassword } } });
    },
  };
};
