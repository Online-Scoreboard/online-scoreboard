import React from 'react';
import { shallow } from 'enzyme';
import * as Auth from '../../hooks/useData';
import * as Notification from '../Notification';
import { Loading } from '../Loading';

import { App } from './App';

jest.mock('../../hooks/useData');
jest.mock('../Notification');

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

  jest.spyOn(Auth, 'useData').mockImplementation(
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

  jest.spyOn(Notification, 'useNotification').mockImplementation(() => ({
    openNotification: jest.fn(),
    dismissNotification: jest.fn(),
    message: '',
    variant: 'info',
    open: false,
  }));

  it('should render without crashing', () => {
    // Act
    const app = shallow(<App />);

    // Assert
    expect(app.find('div').hasClass('App')).toBe(true);
  });

  it('should display a loading spinner while fetching the initial data', () => {
    // Arrange
    mockLoading = true;

    // Act
    const app = shallow(<App />);

    // Assert
    expect(app.find(Loading).exists()).toBe(true);
  });

  it('should remove the loading spinner after the initial data has been fetched', () => {
    // Arrange
    mockLoading = false;

    // Act
    const app = shallow(<App />);

    // Assert
    expect(app.find(Loading).exists()).toBe(false);
  });
});
