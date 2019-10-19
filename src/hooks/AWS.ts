import { Auth } from 'aws-amplify';
import { DEFAULT_ERROR_MESSAGE } from '../helpers/strings';

export interface AWSUser {
  attributes: {
    email: string;
    email_verified: boolean;
  };
  username: string;
}

export const awsSignIn = async (username: string, password: string) => {
  let res;

  try {
    res = await Auth.signIn(username, password);
  } catch (err) {
    if (err && err.code === 'UserNotConfirmedException') {
      throw new Error('User not verified');
    }
    if (err && err.message) {
      throw new Error(err.message);
    } else {
      throw new Error(DEFAULT_ERROR_MESSAGE);
    }
  }

  return res;
};

export const awsRegister = async (username: string, password: string) => {
  let res;

  try {
    res = await Auth.signUp(username, password);
  } catch (err) {
    throw new Error(err.message || DEFAULT_ERROR_MESSAGE);
  }

  return res;
};

export const awsSignOut = () => Auth.signOut();

export const getCurrentUser = () => Auth.currentUserInfo();

export const awsVerifyEmail = (username: string, code: string) => Auth.confirmSignUp(username, code);

export const awsResendCode = (username: string) => Auth.resendSignUp(username);

export const awsResetPassword = (email: string) => Auth.forgotPassword(email);

export const awsResetPasswordConfirm = (username: string, code: string, newPassword: string) =>
  Auth.forgotPasswordSubmit(username, code, newPassword);
