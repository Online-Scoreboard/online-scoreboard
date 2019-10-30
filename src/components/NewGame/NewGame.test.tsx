import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';

import { NewGameComponent } from './NewGameComponent';
import { NewGame } from './NewGame';

describe('NewGame', () => {
  it('should render without crashing', () => {
    const newGame = mount(
      <MockedProvider>
        <NewGame />
      </MockedProvider>
    );

    expect(newGame.find(NewGameComponent).exists()).toBe(true);
  });
});
