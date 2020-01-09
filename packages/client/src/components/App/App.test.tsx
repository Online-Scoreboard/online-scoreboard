import React from 'react';
import { shallow } from 'enzyme';
import * as Auth from '../../hooks/Auth';
import * as Notification from '../Notification';
import { Loading } from '../Loading';
import * as Messages from '../../hooks/useMessage';

import { App } from './App';

jest.mock('../../hooks/Auth');
jest.mock('../Notification');
jest.mock('../../hooks/useMessage');

describe('App', () => {
  let mockLoading = false;
  const isLoggedIn = true;
  const mockOperationLoading = false;
  const testUser = {
    email: 'fake@mail.com',
    error: '',
    isLoggedIn,
    username: 'test user',
    __typename: 'UserSession',
  };

  jest.spyOn(Auth, 'useAuth').mockImplementation(
    () =>
      ({
        user: testUser,
        error: undefined,
        loading: mockLoading,
        operationLoading: mockOperationLoading,
        isLoggedIn,
        success: false,
        logIn: jest.fn(),
        logOut: jest.fn(),
      } as any)
  );

  jest.spyOn(Messages, 'useMessage').mockImplementation(() => ({
    body: '',
    variant: '' as any,
    clearMessage: jest.fn(),
    createMessage: jest.fn(),
  }));

  jest.spyOn(Notification, 'useNotification').mockImplementation(() => ({
    openNotification: jest.fn(),
    dismissNotification: jest.fn(),
    message: '',
    variant: 'info',
    open: false,
  }));

  it('should render without crashing', () => {
    const app = shallow(<App />);

    expect(app.exists()).toBe(true);
  });

  it('should render an App component', () => {
    const app = shallow(<App />);

    expect(app.find('div.App').exists()).toBe(true);
  });

  it('should display a loading spinner while fetching the initial data', () => {
    mockLoading = true;
    const app = shallow(<App />);

    expect(app.find(Loading).exists()).toBe(true);
  });

  it('should remove the loading spinner after the initial data has been fetched', () => {
    mockLoading = false;
    const app = shallow(<App />);

    expect(app.find(Loading).exists()).toBe(false);
  });
});
