import React from 'react';
import { shallow, mount } from 'enzyme';

import { Home } from './Home';

describe('DashboardComponent', () => {
  it('should render without crashing', () => {
    shallow(<Home />);

    expect(true).toBeTruthy();
  });

  it('should render a Home component', () => {
    const wrapper = shallow(<Home />);

    expect(wrapper.hasClass('Home')).toBe(true);
  });

  it('should render a main container', () => {
    const wrapper = mount(<Home />);

    expect(wrapper.find('main').exists()).toBe(true);
  });

  it('should render a LogIn button', () => {
    const wrapper = mount(<Home />);

    expect(wrapper.find('a.logIn').exists()).toBe(true);
  });

  it('should navigate to the login page when the LogIn button is clicked', () => {
    const wrapper = mount(<Home />);

    const logIn = wrapper.find('a.logIn');

    expect(logIn.text()).toBe('Log In');
    expect(logIn.getDOMNode().getAttribute('href')).toBe('/login');
  });
});
