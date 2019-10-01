import { Auth } from 'aws-amplify';
import {
  awsSignIn,
  awsRegister,
  awsSignOut,
  getCurrentUser,
  awsVerifyEmail,
  awsResendCode,
  awsResetPassword,
} from './AWS';
import { DEFAULT_ERROR_MESSAGE } from '../../helpers/strings';

jest.mock('aws-amplify');

describe('AWS', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('awsSignIn', () => {
    it('should try to sign a user in', async () => {
      // Act
      await awsSignIn('username', 'password');

      // Assert
      expect(Auth.signIn).toHaveBeenCalledWith('username', 'password');
    });

    it('should throw a generic error when the server does not provide a message', async () => {
      // Arrange
      const expectedErrorMessage = DEFAULT_ERROR_MESSAGE;
      jest.spyOn(Auth, 'signIn').mockRejectedValue('ops');

      // Assert
      expect(awsSignIn('username', 'password')).rejects.toThrowError(expectedErrorMessage);
      expect(Auth.signIn).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when the server provides a specific message', async () => {
      // Arrange
      const expectedErrorMessage = 'User not found';
      jest.spyOn(Auth, 'signIn').mockRejectedValue({
        message: 'User not found',
      });

      // Assert
      expect(awsSignIn('username', 'password')).rejects.toThrowError(expectedErrorMessage);
      expect(Auth.signIn).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when the user is not yet verified', async () => {
      // Arrange
      const expectedErrorMessage = 'User not verified';
      jest.spyOn(Auth, 'signIn').mockRejectedValue({
        code: 'UserNotConfirmedException',
        message: 'some error message',
      });

      // Assert
      expect(awsSignIn('username', 'password')).rejects.toThrowError(expectedErrorMessage);
      expect(Auth.signIn).toHaveBeenCalledTimes(1);
    });
  });

  describe('awsRegister', () => {
    it('Should invoke the AWS signUp method', async () => {
      // Act
      await awsRegister('username', 'password');

      // Assert
      expect(Auth.signUp).toHaveBeenCalledWith('username', 'password');
    });

    it('Should return a response when the registration is successful', async () => {
      jest.spyOn(Auth, 'signUp').mockImplementationOnce(() => {
        return Promise.resolve('ok') as any;
      });

      // Act
      const res = await awsRegister('username', 'password');

      // Assert
      expect(res).toBe('ok');
    });

    it('Should throw an error when the registration fails', async () => {
      // Arrange
      const expectedError = 'test error';
      jest.spyOn(Auth, 'signUp').mockImplementationOnce(async () => {
        throw new Error(expectedError);
      });

      // Assert
      await expect(awsRegister('username', 'password')).rejects.toEqual(Error(expectedError));
    });

    it('Should throw a generic error when not provided', async () => {
      // Arrange
      const expectedError = DEFAULT_ERROR_MESSAGE;
      jest.spyOn(Auth, 'signUp').mockImplementationOnce(async () => {
        throw Error();
      });

      // Assert
      await expect(awsRegister('username', 'password')).rejects.toEqual(Error(expectedError));
    });
  });

  describe('awsSignOut', () => {
    it('should call aws-amplify sign out', () => {
      // Act
      awsSignOut();

      // Assert
      expect(Auth.signOut).toHaveBeenCalled();
    });

    it('should sign an authenticated user out', async () => {
      // Arrange
      const fakeUsername = 'fake_user';

      const currUser = {
        username: '',
      };

      const expectedAuthUser = {
        username: fakeUsername,
      };

      jest.spyOn(Auth, 'signIn').mockImplementationOnce(async (username, pw) => {
        currUser.username = String(username);
      });

      jest.spyOn(Auth, 'signOut').mockImplementationOnce(async () => {
        currUser.username = String('');
      });

      jest.spyOn(Auth, 'currentAuthenticatedUser').mockImplementationOnce(async () => {
        return currUser;
      });

      await Auth.signIn(fakeUsername, 'fake_password');
      let res = await Auth.currentAuthenticatedUser();
      expect(res).toEqual(expectedAuthUser);

      // Act
      await awsSignOut();

      // Assert
      res = await Auth.currentAuthenticatedUser();
      expect(res).toBeUndefined();
    });
  });

  describe('getCurrentUser', () => {
    it('should return the current authenticated user info', async () => {
      // Arrange
      const fakeUsername = 'fake_user';

      const currUser = {
        username: '',
      };

      const expectedAuthUser = {
        username: fakeUsername,
      };

      jest.spyOn(Auth, 'signIn').mockImplementationOnce(async (username, pw) => {
        currUser.username = String(username);
      });

      jest.spyOn(Auth, 'currentUserInfo').mockImplementationOnce(async () => {
        return currUser;
      });

      await Auth.signIn(fakeUsername, 'fake_password');

      // Act
      const res = await getCurrentUser();

      // Assert
      expect(res).toEqual(expectedAuthUser);
    });

    it('should not any user info when the user is not authenticated', async () => {
      // Arrange
      jest.spyOn(Auth, 'currentUserInfo').mockImplementationOnce(async () => undefined);

      // Act
      const res = await getCurrentUser();

      // Assert
      expect(res).toBeUndefined();
    });
  });

  describe('awsVerifyEmail', () => {
    it('should invoke the confirmSignUp AWS method', async () => {
      // Act
      await awsVerifyEmail('username', 'password');

      // Assert
      expect(Auth.confirmSignUp).toHaveBeenCalledWith('username', 'password');
    });
  });

  describe('awsResendCode', () => {
    it('should invoke the confirmSignUp AWS method', async () => {
      // Act
      await awsResendCode('username');

      // Assert
      expect(Auth.resendSignUp).toHaveBeenCalledWith('username');
    });
  });

  describe('awsResetPassword', () => {
    it('should invoke the confirmSignUp AWS method', async () => {
      // Arrange
      const testUsername = 'username@mail.com';

      // Act
      await awsResetPassword(testUsername);

      // Assert
      expect(Auth.forgotPassword).toHaveBeenCalledWith(testUsername);
    });
  });
});
