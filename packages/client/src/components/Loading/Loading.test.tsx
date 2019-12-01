import React from 'react';
import { shallow, mount } from 'enzyme';

import { Loading } from './Loading';

describe('Loading', () => {
  it('should render a Loading component', () => {
    // Act
    const wrapper = shallow(<Loading />);

    // Assert
    expect(wrapper.find('div.Loading').exists()).toBe(true);
  });

  it(`should hide the Loading component when "show" is set to "false"`, () => {
    // Act
    const wrapper = shallow(<Loading show={false} />);

    // Assert
    expect(wrapper.html()).toBeNull();
  });

  it(`should display a loading spinner`, () => {
    // Act
    const wrapper = mount(<Loading />);

    // Assert
    expect(wrapper.find('svg').exists()).toBe(true);
    expect(wrapper.find('circle').exists()).toBe(true);
    expect(wrapper.find('circle').prop('cx')).toBe(44);
    expect(wrapper.find('circle').prop('cy')).toBe(44);
    expect(wrapper.find('circle').prop('r')).toBe(20);
    expect(wrapper.find('circle').prop('strokeWidth')).toBe(4);
  });
});
