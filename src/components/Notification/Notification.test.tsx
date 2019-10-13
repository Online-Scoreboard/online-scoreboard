import React from 'react';
import { mount, shallow } from 'enzyme';

import { Notification } from './Notification';

describe('Notification', () => {
  it('should render a notification component', () => {
    // Arrange
    const el = (
      <div>
        <Notification message="Allo" open={false} variant="info" />
      </div>
    );

    // Act
    const wrapper = shallow(el);

    // Assert
    expect(wrapper.find(Notification).exists()).toBe(true);
  });

  it('should render an empty notification component when not opened', () => {
    // Arrange
    const el = <Notification message="Allo" open={false} variant="info" />;

    // Act
    const wrapper = mount(el);

    // Assert
    expect(wrapper.find(Notification).html()).toBe('');
  });

  it('should render a notification component when opened', () => {
    // Arrange
    (global as any).matchMedia = (media: any) => ({
      addListener: () => {},
      removeListener: () => {},
      matches: true,
    });

    const el = <Notification message="Allo" open={true} variant="info" />;

    // Act
    const wrapper = mount(el);

    // Assert
    expect(wrapper.find(Notification).html()).toMatchSnapshot();
    expect(wrapper.find('span#client-snackbar').text()).toEqual('Allo');
  });

  it('should not render a notification component when the message is empty', () => {
    // Arrange
    const el = <Notification message="" open={true} variant="info" />;

    // Act
    const wrapper = mount(el);

    // Assert
    expect(wrapper.find(Notification).html()).toBe('');
  });

  it('should render an `info` notification', () => {
    // Arrange
    const el = <Notification message="Allo" open={true} variant="info" />;

    // Act
    const wrapper = mount(el);

    // Assert
    expect(wrapper.find('div.makeStyles-info-10').exists()).toBe(true);
  });

  it('should render an `error` notification', () => {
    // Arrange
    const el = <Notification message="Allo" open={true} variant="error" />;

    // Act
    const wrapper = mount(el);

    // Assert
    expect(wrapper.find('div.makeStyles-error-9').exists()).toBe(true);
  });

  it('should render an `success` notification', () => {
    // Arrange
    const el = <Notification message="Allo" open={true} variant="success" />;

    // Act
    const wrapper = mount(el);

    // Assert
    expect(wrapper.find('div.makeStyles-success-8').exists()).toBe(true);
  });

  it('should render an `warning` notification', () => {
    // Arrange
    const el = <Notification message="Allo" open={true} variant="warning" />;

    // Act
    const wrapper = mount(el);

    // Assert
    expect(wrapper.find('div.makeStyles-warning-11').exists()).toBe(true);
  });
});
