import { Resolvers } from 'apollo-client';

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
import { GET_USER } from './useAuth.graph';
import { DEFAULT_ERROR_MESSAGE } from '../../helpers/strings';
import { User } from './types';

const userInitialState: User = {
  __typename: 'UserSession',
  isLoggedIn: false,
  confirmEmail: false,
  resetPassword: false,
  username: '',
  email: '',
  error: '',
  info: '',
};

export const resolvers: Resolvers = {
  Query: {
    async user(parent, _, { cache }) {
      const currUser = parent.user;

      const data: User = {
        ...userInitialState,
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
        data.email = user.attributes.email;
      }

      cache.writeData({ data: { user: data } });
      return data;
    },
  },

  Mutation: {
    async resetErrors(_, __, { cache }): Promise<void> {
      const currState = cache.readQuery({ query: GET_USER });
      const userData: User = { ...currState.user };

      userData.error = '';
      userData.info = '';
      cache.writeData({ data: { user: userData } });
    },

    async logIn(_, { loginData }, { cache }): Promise<any> {
      const currState = cache.readQuery({ query: GET_USER });
      const userData: User = { ...currState.user };

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
      return { __typename: 'Login', id: userData.username };
    },

    async register(_, { registerData }, { cache }): Promise<void> {
      const currState = cache.readQuery({ query: GET_USER });
      const userData: User = { ...currState.user };

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
      const userData: User = { ...currState.user };
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
      const userData: User = { ...currState.user };

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
      const userData: User = { ...currState.user };
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
      const userData: User = { ...currState.user };
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
      const userData: User = { ...currState.user };

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
