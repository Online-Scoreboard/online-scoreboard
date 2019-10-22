import React from 'react';
import { shallow } from 'enzyme';

import { User } from '../../hooks/Auth';
import { Classes } from './Dashboard.styles';
import { DashboardComponent } from './DashboardComponent';

describe('DashboardComponent', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
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
});
