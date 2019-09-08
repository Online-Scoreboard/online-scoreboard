import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Auth } from 'aws-amplify';

type User = {
  attributes: {
    email: string;
    email_verified: boolean;
    sub: string;
  };
  username: string;
};

interface AuthContext {
  isLoggedIn: boolean;
  user?: User;
  logIn: (username: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const authInitialState = {
  isLoggedIn: false,
} as AuthContext;

const authContext = createContext(authInitialState);

const awsSignIn = async (username: string, password: string) => {
  let res;
  try {
    res = await Auth.signIn(username, password);
  } catch (err) {
    if (err && err.code === 'UserNotConfirmedException') {
      //   type: SIGN_IN_CODE_CONFIRMATION,
      //   payload: data.username,
    }
    if (err && err.message) {
      console.error(err.message);
      throw new Error(err.message);
    } else {
      console.error('Something went wrong. Please try again later.');
      throw new Error('Something went wrong. Please try again later.');
    }
  }
  return res;
};

const awsSignOut = () => Auth.signOut();

const getAuthenticationStatus = async () => {
  let user;
  try {
    user = await Auth.currentAuthenticatedUser();
  } catch (err) {
    throw new Error(err);
  }

  return user;
};

type ActionType = 'logIn' | 'logOut' | 'logInError' | 'userAuthenticated';

interface Action {
  type: ActionType;
  payload?: any;
}

interface State {
  isLoggedIn: boolean;
  user?: User;
  message?: {
    body: string;
    type: 'success' | 'warning' | 'error' | 'info';
  };
}

const initialState: State = {
  isLoggedIn: false,
};

const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'logIn':
      return {
        ...state,
        isLoggedIn: true,
        message: {
          body: `Welcome back ${state.user}`,
          type: 'success',
        },
      };
    case 'logOut':
      return {
        ...state,
        isLoggedIn: false,
      };
    case 'logInError':
      return {
        ...state,
        isLoggedIn: false,
        message: {
          body: action.payload,
          type: 'error',
        },
      };
    case 'userAuthenticated':
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
      };
    default:
      return state;
  }
};

const useProvideAuth = (): AuthContext => {
  const [{ user, isLoggedIn }, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    getAuthenticationStatus()
      .then(res => {
        console.warn('getAuthenticationStatus', res);
        if (res && res.username) {
          dispatch({ type: 'userAuthenticated', payload: res });
        }
      })
      .catch((err: any) => {
        console.warn('getAuthenticationStatus', err);
        dispatch({ type: 'logOut' });
      });
  }, []);

  const logIn = async (username: string, password: string) => {
    try {
      await awsSignIn(username, password);
    } catch (errMessage) {
      dispatch({
        type: 'logInError',
        payload: errMessage,
      });
    }
    dispatch({ type: 'logIn' });
  };

  const logOut = async () => {
    await awsSignOut();
    dispatch({ type: 'logOut' });
  };

  return {
    user,
    isLoggedIn,
    logIn,
    logOut,
  };
};

export const ProvideAuth: React.FC = ({ children }) => {
  const auth = useProvideAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => useContext(authContext);
