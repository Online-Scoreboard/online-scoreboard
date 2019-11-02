import React from 'react';
import { shallow } from 'enzyme';

import { Footer } from './Footer';

describe('Footer', () => {
  it('should render without crashing', () => {
    shallow(<Footer />);

    expect(true).toBeTruthy();
  });

  it('should render a copyright', () => {
    const year = new Date().getFullYear();
    const expectedCopy = `Copyright © @andreasonny83 ${year}. Built with ❤️.`;

    const wrapper = shallow(<Footer />);
    const copyright = wrapper.find('.copyright');

    expect(copyright.text()).toBe(expectedCopy);
  });
});
