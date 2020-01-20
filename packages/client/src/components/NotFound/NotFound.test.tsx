import React from 'react';
import { shallow } from 'enzyme';

import { NotFound } from './NotFound';

describe('DashboardComponent', () => {
  it('should render without crashing', () => {
    shallow(<NotFound />);

    expect(true).toBeTruthy();
  });

  it('should render a not found message', () => {
    const wrapper = shallow(<NotFound />);

    expect(wrapper.text()).toEqual('Sorry, nothing here');
  });
});
