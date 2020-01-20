import React from 'react';
import { shallow, mount } from 'enzyme';

import { createHistory, createMemorySource, LocationProvider } from '@reach/router';
import * as Router from '@reach/router';
import { Auth } from '../components/Auth';
import { Dashboard } from '../components/Dashboard';
import { Profile } from '../components/Profile';
import { NewGame } from '../components/NewGame';
import { Game } from '../components/Game';
import { PrivateRouter } from './PrivateRouter';

jest.mock('../components/Auth');
jest.mock('../components/Dashboard');
jest.mock('../components/Profile');
jest.mock('../components/NewGame');
jest.mock('../components/Game');

interface RenderRoute {
  pathname: string;
  isLoggedIn?: boolean;
  confirmEmail?: boolean;
  user?: any;
}

const renderRoute = ({ pathname, isLoggedIn = false, confirmEmail = false, user = {} }: RenderRoute) => {
  const testHistory = createHistory(createMemorySource(pathname));

  const wrapper = mount(
    <LocationProvider history={testHistory}>
      <PrivateRouter isLoggedIn={isLoggedIn} confirmEmail={confirmEmail} user={user} />
    </LocationProvider>
  );

  return wrapper;
};

describe('PrivateRouter', () => {
  it('should render without crashing', () => {
    shallow(<PrivateRouter confirmEmail={false} isLoggedIn={false} />);

    expect(true).toBeTruthy();
  });

  it.each(['/home', '/', '', '/test', '/404', 'test', '/game/123'])(
    'should render the Auth component by default',
    testPath => {
      const wrapper = renderRoute({ pathname: testPath });

      expect(wrapper.find(Auth).exists()).toBe(true);
    }
  );

  it('should return the user dashboard page', () => {
    const testUser = { username: 'testUser' };

    const wrapper = renderRoute({ pathname: '/home', isLoggedIn: true, user: testUser });

    expect(wrapper.find(Dashboard).exists()).toBe(true);
  });

  it('should return the user profile page', () => {
    const testUser = { username: 'testUser' };

    const wrapper = renderRoute({ pathname: '/profile', isLoggedIn: true, user: testUser });

    expect(wrapper.find(Profile).exists()).toBe(true);
  });

  it('should return the user account page', () => {
    const testUser = { username: 'testUser' };

    const wrapper = renderRoute({ pathname: '/account', isLoggedIn: true, user: testUser });

    expect(wrapper.find(Dashboard).exists()).toBe(true);
  });

  it('should return a new game page', () => {
    const testUser = { username: 'testUser' };

    const wrapper = renderRoute({ pathname: '/new-game', isLoggedIn: true, user: testUser });

    expect(wrapper.find(NewGame).exists()).toBe(true);
  });

  it('should return a game page', () => {
    const testUser = { username: 'testUser' };

    const wrapper = renderRoute({ pathname: '/game/123', isLoggedIn: true, user: testUser });

    expect(wrapper.find(Game).exists()).toBe(true);
  });

  it.each(['', 'test', '/test', '/game', '/404', '/login', '/12313123'])(
    'should redirect to the user dashboard by default when the path is "%s"',
    () => {
      const testUser = { username: 'testUser' };

      const wrapper = renderRoute({ pathname: '/game', isLoggedIn: true, user: testUser });

      expect(wrapper.find(Router.Redirect).exists()).toBe(true);
    }
  );
});
