import React from 'react';
import { shallow } from 'enzyme';

import { Classes } from './NewGame.styles';
import { NewGameComponent } from './NewGameComponent';

describe('NewGameComponent', () => {
  it('should render without crashing', () => {
    const classes = {} as Classes;
    const newGame = jest.fn();

    shallow(<NewGameComponent classes={classes} newGameLoading={false} newGame={newGame} />);

    expect(true).toBeTruthy();
  });
});
