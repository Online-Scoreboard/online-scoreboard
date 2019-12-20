import { useEffect, useCallback } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { createHook } from 'hookleton';

import { LOGIN_WELCOME_MESSAGE } from '../../helpers/strings';
import { resolvers } from './useAuth.resolvers';
import { User } from './types';
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
} from './useAuth.graph';

interface UserData {
  id: string;
  username: string;
  avatar: string;
}

export const useAuth = createHook(() => {
  const client = useApolloClient();
  client.addResolvers(resolvers);

  const { loading: userLoading, data } = useQuery<{ user: User }>(GET_USER);
  const { loading: userDataLoading, data: whoAmIData } = useQuery<{ whoAmI: UserData }>(GET_USER_DATA);
  const [_logOut, { loading: logOutLoading }] = useMutation<void>(LOG_OUT);
  const [_logIn, { loading: logInLoading }] = useMutation<void>(LOG_IN, { refetchQueries: [{ query: GET_USER }] });
  const [_register, { loading: registerLoading }] = useMutation<void>(REGISTER);
  const [_verifyEmail, { loading: verifyEmailLoading }] = useMutation<void>(VERIFY_EMAIL);
  const [_resendCode, { loading: resendCodeLoading }] = useMutation<void>(RESEND_CODE);
  const [resetErrors] = useMutation<void>(RESET_ERRORS);
  const [_forgottenPassword, { loading: forgottenPasswordLoading }] = useMutation<void>(FORGOTTEN_PASSWORD);
  const [_resetPassword, { loading: resetPasswordLoading }] = useMutation<void>(RESET_PASSWORD);
  const [createUser, { loading: createUserLoading, called: createUserCalled }] = useMutation<void>(CREATE_USER, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_USER }, { query: GET_USER_DATA }],
  });

  const user = data && data.user;
  const userData = whoAmIData && whoAmIData.whoAmI;

  const isLoggedIn = Boolean(user && user.isLoggedIn);
  const confirmEmail = Boolean(user && user.confirmEmail);
  const showResetPassword = Boolean(user && user.resetPassword);
  const success = isLoggedIn && LOGIN_WELCOME_MESSAGE;

  useEffect(() => {
    if (
      !createUserCalled &&
      user &&
      isLoggedIn &&
      !userLoading &&
      !userDataLoading &&
      !userData &&
      !createUserLoading &&
      typeof userData === 'object'
    ) {
      createUser();
    }
  }, [user, userData, userLoading, userDataLoading, isLoggedIn, createUser, createUserLoading, createUserCalled]);

  return {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    user: {
      ...user,
      ...userData,
    } as User,
    isLoggedIn,
    confirmEmail,
    showResetPassword,
    loading: userLoading || userDataLoading,
    operationLoading:
      userLoading ||
      logInLoading ||
      userDataLoading ||
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
    logIn: useCallback(
      async (username: string, password: string) => {
        await resetErrors();
        _logIn({ variables: { loginData: { username, password } } });
      },
      [resetErrors, _logIn]
    ),
    register: useCallback(
      async (username: string, password: string) => {
        await resetErrors();
        _register({ variables: { registerData: { username, password } } });
      },
      [resetErrors, _register]
    ),
    verifyEmail: useCallback(
      async (code: string) => {
        await resetErrors();
        _verifyEmail({ variables: { verifyEmailData: { code } } });
      },
      [resetErrors, _verifyEmail]
    ),
    resendCode: useCallback(async () => {
      await resetErrors();
      _resendCode();
    }, [resetErrors, _resendCode]),
    logOut: useCallback(async () => {
      await resetErrors();
      _logOut();
    }, [resetErrors, _logOut]),
    forgottenPassword: useCallback(
      async (email: string) => {
        await resetErrors();
        _forgottenPassword({ variables: { forgottenPasswordData: { email } } });
      },
      [resetErrors, _forgottenPassword]
    ),
    resetPassword: useCallback(
      async (username: string, code: string, newPassword: string) => {
        await resetErrors();
        _resetPassword({ variables: { resetPasswordData: { username, code, newPassword } } });
      },
      [resetErrors, _resetPassword]
    ),
  };
});

// Auth Context provider
export const AuthHost = () => {
  useAuth.use();
  return null;
};
