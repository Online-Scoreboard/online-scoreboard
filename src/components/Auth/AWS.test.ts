import { Auth } from 'aws-amplify';
import { awsSignIn, awsSignOut, getCurrentUser } from './AWS';

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
      const expectedErrorMessage = 'Something went wrong. Please try again later.';
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
});
