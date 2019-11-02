import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';

import { GameName } from './GameName';

describe('GameName', () => {
  it('should render without crashing', () => {
    const gameName = '';
    const onChange = jest.fn();

    shallow(<GameName gameName={gameName} onChange={onChange} />);

    expect(true).toBeTruthy();
  });

  it('should emit a "handleChange" event when changing the game name', () => {
    const gameName = '';
    const onChange = jest.fn();
    const testValue = 'Hello';

    const wrapper = mount(<GameName gameName={gameName} onChange={onChange} />);

    act(() => {
      wrapper
        .find('.gameName')
        .find('input')
        .simulate('change', { target: { value: testValue } });
    });

    wrapper.update();

    expect(onChange).toBeCalledWith(testValue);
  });

  it('should set the game name value according to the "gameName" prop', () => {
    const onChange = jest.fn();
    const testGameName = 'testGameName';

    const wrapper = mount(<GameName gameName={testGameName} onChange={onChange} />);
    const input = wrapper.find('.gameName').find('input');

    expect(input.prop('value')).toBe(testGameName);
  });
});
