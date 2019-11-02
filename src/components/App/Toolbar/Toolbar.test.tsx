import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';

import { Toolbar } from './Toolbar';

describe('Toolbar', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('should render without crashing', () => {
    const isLoggedIn = false;
    const onLogOut = jest.fn();

    shallow(<Toolbar isLoggedIn={isLoggedIn} onLogOut={onLogOut} />);

    expect(true).toBeTruthy();
  });

  it('should render the app name as a page title', () => {
    const isLoggedIn = false;
    const onLogOut = jest.fn();
    const expectedCopy = 'Online Scoreboard';

    const wrapper = shallow(<Toolbar isLoggedIn={isLoggedIn} onLogOut={onLogOut} />);
    const pageTitle = wrapper.find('.pageTitle');

    expect(pageTitle.text()).toBe(expectedCopy);
  });

  it('should render a login button when the user is logged out', () => {
    const isLoggedIn = false;
    const onLogOut = jest.fn();

    const wrapper = shallow(<Toolbar isLoggedIn={isLoggedIn} onLogOut={onLogOut} />);
    const loginButton = wrapper.find('.logIn');

    expect(loginButton.exists()).toBe(true);
  });

  it('should hide the login button when the user is logged in', () => {
    const isLoggedIn = true;
    const user = {};
    const onLogOut = jest.fn();

    const wrapper = shallow(<Toolbar isLoggedIn={isLoggedIn} onLogOut={onLogOut} user={user} />);
    const loginButton = wrapper.find('.logIn');

    expect(loginButton.exists()).toBe(false);
  });

  it('should hide a user dropdown menu when the user is logged out', () => {
    const isLoggedIn = false;
    const onLogOut = jest.fn();

    const wrapper = shallow(<Toolbar isLoggedIn={isLoggedIn} onLogOut={onLogOut} />);
    const userMenu = wrapper.find('.userMenu');

    expect(userMenu.exists()).toBe(false);
  });

  it('should render a user dropdown menu when the user is logged in', () => {
    const isLoggedIn = true;
    const user = {};
    const onLogOut = jest.fn();

    const wrapper = shallow(<Toolbar isLoggedIn={isLoggedIn} onLogOut={onLogOut} user={user} />);
    const userMenu = wrapper.find('.userMenu');

    expect(userMenu.exists()).toBe(true);
  });

  it('should emit a "onLogOut" event as the user log out', () => {
    const isLoggedIn = true;
    const user = {};
    const onLogOut = jest.fn();

    const wrapper = mount(<Toolbar isLoggedIn={isLoggedIn} onLogOut={onLogOut} user={user} />);
    const userMenu = wrapper.find('.userMenu');
    const testEl = document.createElement('div');
    const userMenuOnClick = userMenu.first().props().onClick;

    act(() => {
      if (userMenuOnClick) {
        userMenuOnClick({ currentTarget: testEl } as React.MouseEvent<any>);
      }
    });

    wrapper.update();

    const isMenuOpen = wrapper
      .find('#menu-appbar')
      .first()
      .prop('open');

    expect(isMenuOpen).toBe(true);

    const logOutButton = wrapper.find('.logOut');
    const logOutButtonClick = logOutButton.first().props().onClick;

    act(() => {
      if (logOutButtonClick) {
        logOutButtonClick({} as React.MouseEvent<any>);
      }
    });

    expect(onLogOut).toBeCalled();
  });
});
