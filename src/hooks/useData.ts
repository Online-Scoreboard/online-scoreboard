import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { uniqueNamesGenerator } from 'unique-names-generator';

import { useEffect, useCallback } from 'react';
import { resolvers, UserSessionData } from './useData.resolvers';
import { LOGIN_WELCOME_MESSAGE } from '../helpers/strings';
import {
  GET_USER,
  GET_USER_DATA,
  LOG_OUT,
  CREATE_USER,
  LOG_IN,
  REGISTER,
  VERIFY_EMAIL,
  RESEND_CODE,
  RESET_ERRORS,
  FORGOTTEN_PASSWORD,
  RESET_PASSWORD,
  SHUFFLE_AVATAR,
} from './useData.graph';

interface UserData {
  avatar: string;
}

export const useData = () => {
  const client = useApolloClient();
  client.addResolvers(resolvers);

  const { loading: userLoading, data } = useQuery<{ user: UserSessionData }>(GET_USER);
  const { loading: userDataLoading, data: whoAmIData } = useQuery<{ whoAmI: UserData }>(GET_USER_DATA);
  const [_logOut, { loading: logOutLoading }] = useMutation<void>(LOG_OUT);
  const [createUser, { loading: createUserLoading }] = useMutation<void>(CREATE_USER);
  const [_logIn, { loading: logInLoading }] = useMutation<void>(LOG_IN);
  const [_register, { loading: registerLoading }] = useMutation<void>(REGISTER);
  const [_verifyEmail, { loading: verifyEmailLoading }] = useMutation<void>(VERIFY_EMAIL);
  const [_resendCode, { loading: resendCodeLoading }] = useMutation<void>(RESEND_CODE);
  const [resetErrors] = useMutation<void>(RESET_ERRORS);
  const [_forgottenPassword, { loading: forgottenPasswordLoading }] = useMutation<void>(FORGOTTEN_PASSWORD);
  const [_resetPassword, { loading: resetPasswordLoading }] = useMutation<void>(RESET_PASSWORD);
  const [_shuffleAvatar, { loading: shuffleAvatarLoading }] = useMutation<void>(SHUFFLE_AVATAR, {
    refetchQueries: ['GetUserData'],
  });

  const user = data && data.user;
  const userData = whoAmIData && whoAmIData.whoAmI;

  const isLoggedIn = Boolean(user && user.isLoggedIn);
  const confirmEmail = Boolean(user && user.confirmEmail);
  const showResetPassword = Boolean(user && user.resetPassword);
  const success = isLoggedIn && LOGIN_WELCOME_MESSAGE;

  useEffect(() => {
    if (user && isLoggedIn && !userLoading && !userDataLoading && !userData && typeof userData === 'object') {
      createUser();
    }
  }, [user, userData, userLoading, userDataLoading, isLoggedIn, createUser]);

  return {
    user: {
      ...user,
      ...userData,
    } as UserSessionData,
    isLoggedIn,
    confirmEmail,
    showResetPassword,
    loading: userLoading,
    operationLoading:
      logInLoading ||
      userDataLoading ||
      createUserLoading ||
      logOutLoading ||
      registerLoading ||
      verifyEmailLoading ||
      resendCodeLoading ||
      resetPasswordLoading ||
      shuffleAvatarLoading ||
      forgottenPasswordLoading,
    error: user && user.error,
    info: user && user.info,
    success,
    shuffleAvatar: useCallback(() => {
      const hash = uniqueNamesGenerator();
      _shuffleAvatar({ variables: { updateUserInput: { avatar: hash } } });
    }, [_shuffleAvatar]),
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
