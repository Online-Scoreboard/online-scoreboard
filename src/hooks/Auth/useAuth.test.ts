import apollo from '@apollo/react-hooks';
import { renderHook, act } from '@testing-library/react-hooks';

import { useAuth } from './useAuth';

jest.mock(
  '@apollo/react-hooks',
  () =>
    ({
      useApolloClient: jest.fn(() => ({
        addResolvers: jest.fn(),
      })),
      useQuery: jest.fn(() => ({
        loading: false,
        error: false,
        data: {},
      })),
      useMutation: jest.fn(() => {
        return [jest.fn(), { loading: false }];
      }),
    } as any)
);

describe('useData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    renderHook(() => useAuth());
  });

  it('should inject custom apollo resolvers', () => {
    const spyAddResolvers = jest.fn();
    jest.spyOn(apollo, 'useApolloClient').mockImplementationOnce(
      () =>
        ({
          addResolvers: spyAddResolvers,
        } as any)
    );

    renderHook(() => useAuth());

    expect(spyAddResolvers).toBeCalledWith(expect.any(Object));
  });

  it('should fetch a user', () => {
    const expectedUser = {
      username: 'testUser',
    };

    jest.spyOn(apollo, 'useQuery').mockImplementationOnce(({ definitions }: any) => {
      const query = definitions && definitions[0] && definitions[0].name && definitions[0].name.value;

      const data: any = {};
      if (query === 'GetUser') {
        data.user = expectedUser;
      }

      return {
        loading: false,
        error: false,
        data,
      } as any;
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(expectedUser);
  });

  it('should fetch a user avatar', () => {
    const expectedUser = {
      avatar: 'testAvatar',
    };

    jest.spyOn(apollo, 'useQuery').mockImplementation(({ definitions }: any) => {
      const query = definitions && definitions[0] && definitions[0].name && definitions[0].name.value;
      const data: any = { user: {} };

      if (query === 'GetUserData') {
        data.whoAmI = expectedUser;
      }

      return {
        loading: false,
        error: false,
        data,
      } as any;
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(expectedUser);
  });

  it('isLoggedIn', async () => {
    const resetErrorsSpy = jest.fn();
    const logInSpy = jest.fn();

    const testPassword = 'password';
    const testUsername = 'username';

    jest.spyOn(apollo, 'useMutation').mockImplementation(({ definitions }: any) => {
      const mutationName = definitions && definitions[0] && definitions[0].name && definitions[0].name.value;

      if (mutationName === 'ResetErrors') {
        return [resetErrorsSpy, {}];
      }

      if (mutationName === 'LogIn') {
        return [logInSpy, {}];
      }

      return [jest.fn(), {}] as any;
    });

    const { result } = renderHook(() => useAuth());
    const { logIn } = result.current;

    await act(async () => {
      await logIn(testUsername, testPassword);
    });

    expect(resetErrorsSpy).toBeCalled();
    expect(logInSpy).toBeCalledWith({
      variables: {
        loginData: {
          username: testUsername,
          password: testPassword,
        },
      },
    });
  });

  it('register', async () => {
    const resetErrorsSpy = jest.fn();
    const registerSpy = jest.fn();

    const testPassword = 'password';
    const testUsername = 'username';

    jest.spyOn(apollo, 'useMutation').mockImplementation(({ definitions }: any) => {
      const mutationName = definitions && definitions[0] && definitions[0].name && definitions[0].name.value;

      if (mutationName === 'ResetErrors') {
        return [resetErrorsSpy, {}];
      }

      if (mutationName === 'Register') {
        return [registerSpy, {}];
      }

      return [jest.fn(), {}] as any;
    });

    const { result } = renderHook(() => useAuth());
    const { register } = result.current;

    await act(async () => {
      await register(testUsername, testPassword);
    });

    expect(resetErrorsSpy).toBeCalled();
    expect(registerSpy).toBeCalledWith({
      variables: {
        registerData: {
          username: testUsername,
          password: testPassword,
        },
      },
    });
  });

  it('verifyEmail', async () => {
    const resetErrorsSpy = jest.fn();
    const verifyEmailSpy = jest.fn();

    const testCode = '123';

    jest.spyOn(apollo, 'useMutation').mockImplementation(({ definitions }: any) => {
      const mutationName = definitions && definitions[0] && definitions[0].name && definitions[0].name.value;

      if (mutationName === 'ResetErrors') {
        return [resetErrorsSpy, {}];
      }

      if (mutationName === 'VerifyEmail') {
        return [verifyEmailSpy, {}];
      }

      return [jest.fn(), {}] as any;
    });

    const { result } = renderHook(() => useAuth());
    const { verifyEmail } = result.current;

    await act(async () => {
      await verifyEmail(testCode);
    });

    expect(resetErrorsSpy).toBeCalled();
    expect(verifyEmailSpy).toBeCalledWith({
      variables: {
        verifyEmailData: {
          code: testCode,
        },
      },
    });
  });

  it('resendCode', async () => {
    const resetErrorsSpy = jest.fn();
    const resendCodeSpy = jest.fn();

    jest.spyOn(apollo, 'useMutation').mockImplementation(({ definitions }: any) => {
      const mutationName = definitions && definitions[0] && definitions[0].name && definitions[0].name.value;

      if (mutationName === 'ResetErrors') {
        return [resetErrorsSpy, {}];
      }

      if (mutationName === 'ResendCode') {
        return [resendCodeSpy, {}];
      }

      return [jest.fn(), {}] as any;
    });

    const { result } = renderHook(() => useAuth());
    const { resendCode } = result.current;

    await act(async () => {
      await resendCode();
    });

    expect(resetErrorsSpy).toBeCalled();
    expect(resendCodeSpy).toBeCalledWith();
  });

  it('logOut', async () => {
    const resetErrorsSpy = jest.fn();
    const logOutSpy = jest.fn();

    jest.spyOn(apollo, 'useMutation').mockImplementation(({ definitions }: any) => {
      const mutationName = definitions && definitions[0] && definitions[0].name && definitions[0].name.value;

      if (mutationName === 'ResetErrors') {
        return [resetErrorsSpy, {}];
      }

      if (mutationName === 'LogOut') {
        return [logOutSpy, {}];
      }

      return [jest.fn(), {}] as any;
    });

    const { result } = renderHook(() => useAuth());
    const { logOut } = result.current;

    await act(async () => {
      await logOut();
    });

    expect(resetErrorsSpy).toBeCalled();
    expect(logOutSpy).toBeCalledWith();
  });

  it('forgottenPassword', async () => {
    const resetErrorsSpy = jest.fn();
    const forgottenPasswordSpy = jest.fn();

    const testEmail = 'testEmail';

    jest.spyOn(apollo, 'useMutation').mockImplementation(({ definitions }: any) => {
      const mutationName = definitions && definitions[0] && definitions[0].name && definitions[0].name.value;

      if (mutationName === 'ResetErrors') {
        return [resetErrorsSpy, {}];
      }

      if (mutationName === 'ForgottenPassword') {
        return [forgottenPasswordSpy, {}];
      }

      return [jest.fn(), {}] as any;
    });

    const { result } = renderHook(() => useAuth());
    const { forgottenPassword } = result.current;

    await act(async () => {
      await forgottenPassword(testEmail);
    });

    expect(resetErrorsSpy).toBeCalled();
    expect(forgottenPasswordSpy).toBeCalledWith({
      variables: {
        forgottenPasswordData: {
          email: testEmail,
        },
      },
    });
  });

  it('resetPassword', async () => {
    const resetErrorsSpy = jest.fn();
    const resetPasswordSpy = jest.fn();

    const testUsername = 'testUsername';
    const testCode = 'testCode';
    const testNewPassword = 'testNewPassword';

    jest.spyOn(apollo, 'useMutation').mockImplementation(({ definitions }: any) => {
      const mutationName = definitions && definitions[0] && definitions[0].name && definitions[0].name.value;

      if (mutationName === 'ResetErrors') {
        return [resetErrorsSpy, {}];
      }

      if (mutationName === 'ResetPassword') {
        return [resetPasswordSpy, {}];
      }

      return [jest.fn(), {}] as any;
    });

    const { result } = renderHook(() => useAuth());
    const { resetPassword } = result.current;

    await act(async () => {
      await resetPassword(testUsername, testCode, testNewPassword);
    });

    expect(resetErrorsSpy).toBeCalled();
    expect(resetPasswordSpy).toBeCalledWith({
      variables: {
        resetPasswordData: {
          code: testCode,
          newPassword: testNewPassword,
          username: testUsername,
        },
      },
    });
  });
});
