import { Auth } from 'aws-amplify';

export const awsSignIn = async (username: string, password: string) => {
  let res;

  try {
    res = await Auth.signIn(username, password);
  } catch (err) {
    if (err && err.code === 'UserNotConfirmedException') {
      throw new Error('User not verified');
      //   type: SIGN_IN_CODE_CONFIRMATION,
      //   payload: data.username,
    }
    if (err && err.message) {
      throw new Error(err.message);
    } else {
      throw new Error('Something went wrong. Please try again later.');
    }
  }

  return res;
};

export const awsSignOut = () => Auth.signOut();

export const getCurrentUser = () => Auth.currentUserInfo();
