import React from 'react';
import { shallow } from 'enzyme';
import * as apolloReactHooks from '@apollo/react-hooks';

import { useNotification } from './useNotification';

jest.mock('@apollo/react-hooks');
jest.useFakeTimers();

describe('useNotification', () => {
  let wrapper: any;
  const useMutationMock = jest.fn();

  jest.spyOn(apolloReactHooks, 'useQuery').mockImplementation(() => {
    return {} as any;
  });

  jest.spyOn(apolloReactHooks, 'useMutation').mockImplementation(() => {
    return [useMutationMock] as any;
  });

  jest.spyOn(apolloReactHooks, 'useApolloClient').mockImplementation(() => {
    return {
      addResolvers: jest.fn(),
    } as any;
  });

  interface DivProps {
    hook: any;
  }

  const Div: React.FC<DivProps> = () => <div />;

  interface TestComponentProps {
    timeout?: number;
  }

  const TestComponent: React.FC<TestComponentProps> = ({ timeout }) => {
    const notificationHook = useNotification(timeout);
    return <Div hook={notificationHook} />;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    wrapper = shallow(<TestComponent />);
  });

  it('should return some properties', () => {
    // Act
    const {
      hook: { open, message, variant, openNotification },
    } = wrapper.find(Div).props();

    // Assert
    expect(open).toBe(false);
    expect(message).toBe('');
    expect(variant).toBe('info');
    expect(openNotification).toBeDefined();
  });

  it('should open a notification', () => {
    // Arrange
    const expectedMessage = 'allo';
    const expectedVariation = 'error';
    const expectedStatus = true;
    const {
      hook: { openNotification },
    } = wrapper.find(Div).props();

    // Act
    openNotification(expectedMessage, expectedVariation);

    // Assert
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(useMutationMock).toHaveBeenCalledTimes(1);
    expect(useMutationMock).toHaveBeenCalledWith({
      variables: {
        openNotificationInput: { message: expectedMessage, openStatus: expectedStatus, variant: expectedVariation },
      },
    });
  });

  it('should reset the notification after a certain time', () => {
    // Arrange
    const message = 'allo';
    const variation = 'error';
    const {
      hook: { openNotification },
    } = wrapper.find(Div).props();

    // Act
    openNotification(message, variation);
    jest.runAllTimers();

    // Assert
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 4000);
    expect(useMutationMock).toHaveBeenCalledTimes(2);
    expect(useMutationMock).toHaveBeenNthCalledWith(2, {
      variables: {
        openNotificationInput: { message: '', openStatus: false, variant: 'info' },
      },
    });
  });

  it('should set a different notification timeout', () => {
    // Arrange
    const testTimeout = 1000;
    wrapper = shallow(<TestComponent timeout={testTimeout} />);

    const {
      hook: { openNotification },
    } = wrapper.find(Div).props();

    // Act
    openNotification('allo');
    jest.runAllTimers();

    // Assert
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), testTimeout);
  });

  it('should not open any notification when a message is not provided', () => {
    // Arrange
    const {
      hook: { openNotification },
    } = wrapper.find(Div).props();

    // Act
    openNotification();
    jest.runAllTimers();

    // Assert
    expect(setTimeout).not.toHaveBeenCalled();
    expect(useMutationMock).not.toHaveBeenCalled();
  });

  it('should dismiss an opened notification', () => {
    // Arrange
    const testMessage = 'message';
    const testVariation = 'info';
    const testTimeout = 1000;
    wrapper = shallow(<TestComponent timeout={testTimeout} />);

    const {
      hook: { openNotification, dismissNotification },
    } = wrapper.find(Div).props();

    // Act
    openNotification(testMessage, testVariation);
    jest.runTimersToTime(500);

    // Assert
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(useMutationMock).toHaveBeenCalledWith({
      variables: {
        openNotificationInput: { message: testMessage, variant: testVariation, openStatus: true },
      },
    });

    // Act
    dismissNotification();

    // Assert
    expect(useMutationMock).toHaveBeenCalledWith({
      variables: { openNotificationInput: { message: '', openStatus: false } },
    });
  });

  it('should dismiss the first notification when another comes in', () => {
    // Arrange
    const testMessage = 'message';
    const testVariation = 'info';
    const testSecondMessage = 'message';
    const testSecondVariation = 'error';
    const testTimeout = 1000;
    wrapper = shallow(<TestComponent timeout={testTimeout} />);

    const {
      hook: { openNotification },
    } = wrapper.find(Div).props();

    // Act
    openNotification(testMessage, testVariation);
    jest.runTimersToTime(50);

    // Assert
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(clearTimeout).not.toHaveBeenCalled();
    expect(useMutationMock).toHaveBeenCalledTimes(1);
    expect(useMutationMock).toHaveBeenCalledWith({
      variables: {
        openNotificationInput: { message: testMessage, variant: testVariation, openStatus: true },
      },
    });

    openNotification(testSecondMessage, testSecondVariation);

    expect(clearTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledTimes(3);
    expect(setTimeout).toHaveBeenNthCalledWith(2, expect.any(Function), 150);
    expect(setTimeout).toHaveBeenNthCalledWith(3, expect.any(Function), 750);

    jest.runTimersToTime(150);

    expect(setTimeout).toHaveBeenCalledTimes(3);
    expect(useMutationMock).toHaveBeenCalledTimes(2);
    expect(useMutationMock).toHaveBeenNthCalledWith(2, {
      variables: { openNotificationInput: { message: '', openStatus: false } },
    });

    jest.runTimersToTime(600);

    expect(setTimeout).toHaveBeenCalledTimes(4);
    expect(setTimeout).toHaveBeenNthCalledWith(4, expect.any(Function), testTimeout);
    expect(useMutationMock).toHaveBeenCalledTimes(3);
    expect(useMutationMock).toHaveBeenNthCalledWith(3, {
      variables: {
        openNotificationInput: { message: testSecondMessage, variant: testSecondVariation, openStatus: true },
      },
    });
  });
});
