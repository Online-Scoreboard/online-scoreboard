import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import * as router from '@reach/router';

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

  it('should allow navigating to the "profile" page', () => {
    const isLoggedIn = true;
    const user = {};
    const onLogOut = jest.fn();
    const spyNavigate = jest.spyOn(router, 'navigate');
    const expectedNavigation = 'profile';

    const wrapper = mount(<Toolbar isLoggedIn={isLoggedIn} onLogOut={onLogOut} user={user} />);

    const profileButton = wrapper.find('.profile');
    expect(profileButton.exists()).toBe(true);

    act(() => {
      const profileButtonClick = profileButton.first().props().onClick;
      const event: any = {};
      profileButtonClick && profileButtonClick(event);
    });

    expect(spyNavigate).toBeCalledWith(expectedNavigation);
  });

  it('should allow navigating to the "account" page', () => {
    const isLoggedIn = true;
    const user = {};
    const onLogOut = jest.fn();
    const spyNavigate = jest.spyOn(router, 'navigate');
    const expectedNavigation = 'account';

    const wrapper = mount(<Toolbar isLoggedIn={isLoggedIn} onLogOut={onLogOut} user={user} />);

    const accountButton = wrapper.find('.account');
    expect(accountButton.exists()).toBe(true);

    act(() => {
      const accountButtonClick = accountButton.first().props().onClick;
      const event: any = {};
      accountButtonClick && accountButtonClick(event);
    });

    expect(spyNavigate).toBeCalledWith(expectedNavigation);
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
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
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
        const event: any = {};
        logOutButtonClick(event);
      }
    });

    expect(onLogOut).toBeCalled();
  });
});
