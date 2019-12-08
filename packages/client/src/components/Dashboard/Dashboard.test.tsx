import React from 'react';
import { shallow } from 'enzyme';

import * as Auth from '../../hooks/Auth';
import { DashboardComponent } from './DashboardComponent';
import { Dashboard } from './Dashboard';

jest.mock('../../hooks/Auth');

describe('Dashboard', () => {
  const mockUserData = {};

  beforeEach(() => {
    jest.spyOn(Auth, 'useAuth').mockImplementation(() => {
      return {
        user: mockUserData,
      } as any;
    });
  });

  it('should render without crashing', () => {
    const dashboard = shallow(<Dashboard />);

    expect(dashboard.find(DashboardComponent).exists()).toBe(true);
  });

  it('should pass a user object to the DashboardComponent', async () => {
    // Render the component
    const dashboard = shallow(<Dashboard />);

    // The first render should have an empty user and shuffleAvatarLoading should be false
    expect(dashboard.find(DashboardComponent).props().user).toBe(mockUserData);
  });
});
