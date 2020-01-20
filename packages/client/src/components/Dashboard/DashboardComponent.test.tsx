import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import * as router from '@reach/router';

import { User } from '../../hooks/Auth';
import { DashboardComponent } from './DashboardComponent';
import { Loading } from '../Loading';

/* eslint-disable @typescript-eslint/consistent-type-assertions */
describe('DashboardComponent', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {
      // void
    });
  });

  it('should render without crashing', () => {
    const mockUser = {} as any;

    shallow(<DashboardComponent user={mockUser} loading={false} />);

    expect(true).toBeTruthy();
  });

  it('should display a loading spinner when loading is set', () => {
    const mockUser = {} as any;

    const dashboard = shallow(<DashboardComponent user={mockUser} loading />);

    expect(dashboard.find(Loading).exists()).toBe(true);
  });

  it('should hide the loading spinner when loading is set to "false"', () => {
    const mockUser = {} as any;

    const dashboard = shallow(<DashboardComponent user={mockUser} loading={false} />);

    expect(dashboard.find(Loading).exists()).toBe(false);
  });

  it('should display welcome message', () => {
    const testUsername = 'testUsername';
    const mockUser = {
      username: testUsername,
    } as User;

    const wrapper = shallow(<DashboardComponent user={mockUser} loading={false} />);

    expect(wrapper.find('.welcome').exists()).toBe(true);
    expect(wrapper.find('.welcome').text()).toBe(`Welcome ${testUsername}!`);
  });

  it('should display a "New Game" button on the screen', () => {
    const testUsername = 'testUsername';
    const mockUser = {
      username: testUsername,
    } as User;

    const wrapper = shallow(<DashboardComponent user={mockUser} loading={false} />);

    const newGameButton = wrapper.find('.NewGame');
    expect(newGameButton.exists()).toBe(true);
  });

  it('should allow navigating to the "New Game" view', () => {
    const testUsername = 'testUsername';
    const mockUser = {
      username: testUsername,
    } as User;
    const spyNavigate = jest.spyOn(router, 'navigate');
    const expectedNavigationUrl = '/new-game';

    const wrapper = mount(<DashboardComponent user={mockUser} loading={false} />);

    act(() => {
      const newGameButton = wrapper.find('.NewGame button');
      newGameButton.simulate('click');
    });
    wrapper.update();

    expect(spyNavigate).toBeCalledWith(expectedNavigationUrl);
  });
});
