import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import * as router from '@reach/router';

import { User } from '../../hooks/Auth';
import { Classes } from './Dashboard.styles';
import { DashboardComponent } from './DashboardComponent';

/* eslint-disable @typescript-eslint/consistent-type-assertions */
describe('DashboardComponent', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {
      // void
    });
  });

  it('should render without crashing', () => {
    const mockUser = {} as any;
    const classes = {} as Classes;

    shallow(<DashboardComponent user={mockUser} classes={classes} />);

    expect(true).toBeTruthy();
  });

  it('should display welcome message', () => {
    const testUsername = 'testUsername';
    const mockUser = {
      username: testUsername,
    } as User;
    const classes = {} as Classes;

    const wrapper = shallow(<DashboardComponent user={mockUser} classes={classes} />);

    expect(wrapper.find('.welcome').exists()).toBe(true);
    expect(wrapper.find('.welcome').text()).toBe(`Welcome ${testUsername}!`);
  });

  it('should display a "New Game" button on the screen', () => {
    const testUsername = 'testUsername';
    const mockUser = {
      username: testUsername,
    } as User;
    const classes = {} as Classes;

    const wrapper = shallow(<DashboardComponent user={mockUser} classes={classes} />);

    const newGameButton = wrapper.find('.NewGame');
    expect(newGameButton.exists()).toBe(true);
  });

  it('should allow navigating to the "New Game" view', () => {
    const testUsername = 'testUsername';
    const mockUser = {
      username: testUsername,
    } as User;
    const classes = {} as Classes;
    const spyNavigate = jest.spyOn(router, 'navigate');
    const expectedNavigationUrl = '/new-game';

    const wrapper = mount(<DashboardComponent user={mockUser} classes={classes} />);

    act(() => {
      const newGameButton = wrapper.find('.NewGame button');
      newGameButton.simulate('click');
    });
    wrapper.update();

    expect(spyNavigate).toBeCalledWith(expectedNavigationUrl);
  });
});
