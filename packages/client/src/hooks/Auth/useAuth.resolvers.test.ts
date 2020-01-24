import { resolvers } from './useAuth.resolvers';

import * as AWS from './AWS';
import { DEFAULT_ERROR_MESSAGE } from '../../helpers/strings';

jest.mock('./AWS');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('useAuth.resolvers', () => {
  const userInitialState = {
    __typename: 'UserSession',
    confirmEmail: false,
    email: '',
    error: '',
    info: '',
    isLoggedIn: false,
    resetPassword: false,
    username: '',
  };

  it('should work without crashing', () => {
    expect(resolvers).toBeDefined();
    expect(true).toBeTruthy();
  });

  it('should export a Query object', () => {
    expect(resolvers).toHaveProperty('Query');
  });

  it('should export a Mutation object', () => {
    expect(resolvers).toHaveProperty('Query');
  });

  describe('Query', () => {
    describe('user', () => {
      const mockCache = {
        cache: {
          writeData: jest.fn(),
        },
      };
      const mockRoot = { user: {} };
      const getUser = resolvers.Query.user;

      it('should get an unauthenticated user from the initial state', async () => {
        const res = await getUser(mockRoot, null, mockCache);

        expect(res).toEqual(userInitialState);
      });

      it('should get an authenticated user from AWS', async () => {
        const testEmail = 'user@test.com';
        const mockCurrentAWSUser = {
          attributes: {
            email: testEmail,
          },
        };
        const expectedUser = {
          ...userInitialState,
          email: mockCurrentAWSUser.attributes.email,
          isLoggedIn: true,
        };

        jest.spyOn(AWS, 'getCurrentUser').mockResolvedValue(mockCurrentAWSUser);

        const res = await getUser(mockRoot, null, mockCache);

        expect(res).toEqual(expectedUser);
        expect(AWS.getCurrentUser).toHaveBeenCalled();
      });
    });
  });

  describe('Mutation', () => {
    describe('resetErrors', () => {
      const mockCache = {
        cache: {
          writeData: jest.fn(),
          readQuery: () => ({
            user: {},
          }),
        },
      };
      const mockRoot = { user: {} };

      it('should reset the errors from the cache', async () => {
        const expectedData = { data: { user: { error: '', info: '' } } };

        const resetErrors = resolvers.Mutation.resetErrors;
        await resetErrors(mockRoot, null, mockCache);

        expect(mockCache.cache.writeData).toBeCalledWith(expectedData);
      });
    });

    describe('logIn', () => {
      const rootData = {
        user: {},
      };
      const mockCache = {
        cache: {
          writeData: jest.fn(),
          readQuery: () => rootData,
        },
      };
      const mockArgs = {
        loginData: {
          username: 'testUsername',
          password: 'testPassword',
        },
      };

      it('should reset the errors from the cache', async () => {
        const expectedData = { user: { error: '', info: '' } };
        rootData.user = {
          error: 'ERRROR',
          info: 'INFO',
        };
        const logIn = resolvers.Mutation.logIn;
        await logIn(null, mockArgs, mockCache);

        expect(mockCache.cache.writeData).toBeCalledWith({ data: expectedData });
      });

      it('should try to authenticate the user', async () => {
        const logIn = resolvers.Mutation.logIn;
        await logIn(null, mockArgs, mockCache);

        expect(AWS.awsSignIn).toBeCalledWith(mockArgs.loginData.username, mockArgs.loginData.password);
      });

      it('should set set the user confirmEmail flag', async () => {
        const testErrorMessage = 'User not verified';

        jest.spyOn(AWS, 'awsSignIn').mockImplementationOnce(() => {
          return Promise.reject({ message: testErrorMessage });
        });

        const logIn = resolvers.Mutation.logIn;
        await logIn(null, mockArgs, mockCache);

        expect(mockCache.cache.writeData).toBeCalledWith({
          data: {
            user: {
              confirmEmail: true,
              isLoggedIn: false,
              email: mockArgs.loginData.username,
              error: testErrorMessage,
              info: '',
            },
          },
        });
      });

      it('should fail authenticating the user', async () => {
        const testErrorMessage = 'Invalid User';
        jest.spyOn(AWS, 'awsSignIn').mockImplementationOnce(() => {
          return Promise.reject({ message: testErrorMessage });
        });

        const logIn = resolvers.Mutation.logIn;
        await logIn(null, mockArgs, mockCache);

        expect(mockCache.cache.writeData).toBeCalledWith({
          data: {
            user: {
              confirmEmail: false,
              isLoggedIn: false,
              error: testErrorMessage,
              info: '',
            },
          },
        });
      });

      it('should fail authenticating the user with a generic error message', async () => {
        jest.spyOn(AWS, 'awsSignIn').mockImplementationOnce(() => {
          return Promise.reject({});
        });

        const logIn = resolvers.Mutation.logIn;
        await logIn(null, mockArgs, mockCache);

        expect(mockCache.cache.writeData).toBeCalledWith({
          data: {
            user: {
              confirmEmail: false,
              isLoggedIn: false,
              error: DEFAULT_ERROR_MESSAGE,
              info: '',
            },
          },
        });
      });

      it('should authenticate a user', async () => {
        const testUser = {
          username: 'TestUser',
          attributes: {
            email: 'user@test.com',
          },
        };
        jest.spyOn(AWS, 'awsSignIn').mockImplementationOnce(() => {
          return Promise.resolve();
        });
        jest.spyOn(AWS, 'getCurrentUser').mockImplementationOnce(() => {
          return Promise.resolve(testUser);
        });

        const logIn = resolvers.Mutation.logIn;
        await logIn(null, mockArgs, mockCache);

        expect(mockCache.cache.writeData).toBeCalledWith({
          data: {
            user: {
              error: '',
              info: '',
              isLoggedIn: true,
              confirmEmail: false,
              email: testUser.attributes.email,
              username: testUser.username,
            },
          },
        });
      });
    });

    describe('register', () => {
      const rootData = {
        user: {},
      };
      const mockCache = {
        cache: {
          writeData: jest.fn(),
          readQuery: () => rootData,
        },
      };
      const mockArgs = {
        registerData: {
          username: 'test@username.com',
          password: 'testPassword',
        },
      };

      it('should reset the errors from the cache', async () => {
        const expectedData = { user: { error: '', info: '' } };
        rootData.user = {
          error: 'ERRROR',
          info: 'INFO',
        };
        jest.spyOn(AWS, 'awsRegister').mockImplementationOnce(() => {
          return Promise.resolve({ userSub: {} }) as any;
        });

        const register = resolvers.Mutation.register;
        await register(null, mockArgs, mockCache);

        expect(mockCache.cache.writeData).toBeCalledWith({ data: expectedData });
      });

      it('should return an error message', async () => {
        const testErrorMessage = 'Invalid User';
        jest.spyOn(AWS, 'awsRegister').mockImplementationOnce(() => {
          return Promise.reject({ message: testErrorMessage });
        });

        const register = resolvers.Mutation.register;
        await register(null, mockArgs, mockCache);

        expect(mockCache.cache.writeData).toBeCalledWith({
          data: {
            user: {
              error: testErrorMessage,
              info: '',
            },
          },
        });
      });

      it('should return a generic error message', async () => {
        jest.spyOn(AWS, 'awsRegister').mockImplementationOnce(() => {
          return Promise.reject({});
        });

        const register = resolvers.Mutation.register;
        await register(null, mockArgs, mockCache);

        expect(mockCache.cache.writeData).toBeCalledWith({
          data: {
            user: {
              error: DEFAULT_ERROR_MESSAGE,
              info: '',
            },
          },
        });
      });

      it('should return a generic error message when the user response is not valid', async () => {
        jest.spyOn(AWS, 'awsRegister').mockImplementationOnce(() => {
          return Promise.resolve({}) as any;
        });

        const register = resolvers.Mutation.register;
        await register(null, mockArgs, mockCache);

        expect(mockCache.cache.writeData).toBeCalledWith({
          data: {
            user: {
              error: DEFAULT_ERROR_MESSAGE,
              info: '',
            },
          },
        });
      });

      it('should return a user with a pending email verification', async () => {
        jest.spyOn(AWS, 'awsRegister').mockImplementationOnce(() => {
          return Promise.resolve({ userSub: 'test', userConfirmed: false }) as any;
        });

        const register = resolvers.Mutation.register;
        await register(null, mockArgs, mockCache);

        expect(mockCache.cache.writeData).toBeCalledWith({
          data: {
            user: {
              error: '',
              info: '',
              confirmEmail: true,
              email: mockArgs.registerData.username,
            },
          },
        });
      });
    });

    describe('verifyEmail', () => {
      const rootData = {
        user: {},
      };
      const mockCache = {
        cache: {
          writeData: jest.fn(),
          readQuery: () => rootData,
        },
      };
      const mockArgs = {
        verifyEmailData: {
          username: 'test@username.com',
          password: 'testPassword',
        },
      };

      it('should reset the errors from the cache', async () => {
        const expectedData = {
          user: { confirmEmail: false, error: '', info: 'User correctly verified. You can now log in' },
        };
        rootData.user = {
          error: 'ERRROR',
          info: 'INFO',
        };
        jest.spyOn(AWS, 'awsVerifyEmail').mockImplementationOnce(() => {
          return Promise.resolve();
        });

        const verifyEmail = resolvers.Mutation.verifyEmail;
        await verifyEmail(null, mockArgs, mockCache);

        expect(mockCache.cache.writeData).toBeCalledWith({ data: expectedData });
      });

      it('should return an error message when the response is not valid', async () => {
        const testErrorMessage = 'Invalid verification code';
        jest.spyOn(AWS, 'awsVerifyEmail').mockImplementationOnce(() => {
          return Promise.reject({ message: testErrorMessage });
        });

        const verifyEmail = resolvers.Mutation.verifyEmail;
        await verifyEmail(null, mockArgs, mockCache);

        expect(mockCache.cache.writeData).toBeCalledWith({
          data: {
            user: {
              info: '',
              error: testErrorMessage,
            },
          },
        });
      });

      it('should return a generic error message when the response is not valid', async () => {
        jest.spyOn(AWS, 'awsVerifyEmail').mockImplementationOnce(() => {
          return Promise.reject({});
        });

        const verifyEmail = resolvers.Mutation.verifyEmail;
        await verifyEmail(null, mockArgs, mockCache);

        expect(mockCache.cache.writeData).toBeCalledWith({
          data: {
            user: {
              info: '',
              error: DEFAULT_ERROR_MESSAGE,
            },
          },
        });
      });
    });

    describe('resendCode', () => {
      const rootData = {
        user: {
          email: '',
          error: '',
          info: '',
        },
      };
      const mockCache = {
        cache: {
          writeData: jest.fn(),
          readQuery: () => rootData,
        },
      };

      it('should successfully send another verification code', async () => {
        rootData.user = {
          email: 'test@mail.com',
          error: 'ERRROR',
          info: 'INFO',
        };

        jest.spyOn(AWS, 'awsResendCode').mockImplementationOnce(() => {
          return Promise.resolve('');
        });

        const resendCode = resolvers.Mutation.resendCode;
        await resendCode(null, null, mockCache);

        expect(mockCache.cache.writeData).toBeCalledWith({
          data: {
            user: {
              error: '',
              email: rootData.user.email,
              info: `New code correctly sent to ${rootData.user.email}`,
            },
          },
        });
      });

      it('should return an error message when the response is not valid', async () => {
        const testErrorMessage = 'Invalid verification code';
        jest.spyOn(AWS, 'awsResendCode').mockImplementationOnce(() => {
          return Promise.reject({ message: testErrorMessage });
        });

        const resendCode = resolvers.Mutation.resendCode;
        await resendCode(null, null, mockCache);

        expect(mockCache.cache.writeData).toBeCalledWith({
          data: {
            user: {
              info: '',
              error: testErrorMessage,
              email: rootData.user.email,
            },
          },
        });
      });

      it('should return a generic error message when the response is not valid', async () => {
        jest.spyOn(AWS, 'awsResendCode').mockImplementationOnce(() => {
          return Promise.reject({});
        });

        const resendCode = resolvers.Mutation.resendCode;
        await resendCode(null, null, mockCache);

        expect(mockCache.cache.writeData).toBeCalledWith({
          data: {
            user: {
              info: '',
              error: DEFAULT_ERROR_MESSAGE,
              email: rootData.user.email,
            },
          },
        });
      });
    });

    describe('forgottenPassword', () => {
      const rootData = {
        user: {
          email: '',
          error: '',
          info: '',
        },
      };
      const mockCache = {
        cache: {
          writeData: jest.fn(),
          readQuery: () => rootData,
        },
      };
      const mockArgs = {
        forgottenPasswordData: {
          email: 'test@username.com',
        },
      };

      it('should successfully send a reset password code', async () => {
        jest.spyOn(AWS, 'awsResendCode').mockImplementationOnce(() => {
          return Promise.resolve('');
        });

        const forgottenPassword = resolvers.Mutation.forgottenPassword;
        await forgottenPassword(null, mockArgs, mockCache);

        expect(mockCache.cache.writeData).toBeCalledWith({
          data: {
            user: {
              error: '',
              info: `Reset password code correctly sent to ${mockArgs.forgottenPasswordData.email}`,
              email: rootData.user.email,
              resetPassword: true,
            },
          },
        });
      });

      it('should return an error message when the response is not valid', async () => {
        const testErrorMessage = 'Invalid verification code';
        jest.spyOn(AWS, 'awsResetPassword').mockImplementationOnce(() => {
          return Promise.reject({ message: testErrorMessage });
        });

        const forgottenPassword = resolvers.Mutation.forgottenPassword;
        await forgottenPassword(null, mockArgs, mockCache);

        expect(mockCache.cache.writeData).toBeCalledWith({
          data: {
            user: {
              info: '',
              error: testErrorMessage,
              email: rootData.user.email,
              resetPassword: false,
            },
          },
        });
      });

      it('should return a generic error message when the response is not valid', async () => {
        jest.spyOn(AWS, 'awsResetPassword').mockImplementationOnce(() => {
          return Promise.reject({});
        });

        const forgottenPassword = resolvers.Mutation.forgottenPassword;
        await forgottenPassword(null, mockArgs, mockCache);

        expect(mockCache.cache.writeData).toBeCalledWith({
          data: {
            user: {
              info: '',
              error: DEFAULT_ERROR_MESSAGE,
              email: rootData.user.email,
              resetPassword: false,
            },
          },
        });
      });
    });
  });
});
