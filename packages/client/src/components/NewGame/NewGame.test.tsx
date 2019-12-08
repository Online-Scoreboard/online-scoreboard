import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import { act } from 'react-dom/test-utils';

import { NewGameComponent } from './NewGameComponent';
import { NewGame } from './NewGame';
import { CREATE_GAME } from './NewGame.graphql';

describe('NewGame', () => {
  const wait = (amount = 0) => new Promise(resolve => setTimeout(resolve, amount));

  it('should render without crashing', () => {
    const newGame = mount(
      <MockedProvider>
        <NewGame />
      </MockedProvider>
    );

    expect(newGame.find(NewGameComponent).exists()).toBe(true);
  });

  it('should handle a newGame', async () => {
    const testNewGameInfo = {};
    const mockMutation = [
      {
        request: {
          query: CREATE_GAME,
          variables: {
            createGameInput: testNewGameInfo,
          },
        },
        loading: jest.fn(),
        result: jest.fn(() => ({
          data: {
            createGame: {
              __typename: 'CreateGameInput',
              id: 's',
            },
          },
        })),
      },
    ];

    const newGame = mount(
      <MockedProvider mocks={mockMutation}>
        <NewGame />
      </MockedProvider>
    );

    act(() => {
      const newGameComponent = newGame.find(NewGameComponent);
      newGameComponent.prop('onSubmit')(testNewGameInfo);
    });
    newGame.update();

    // Simulate the end of the mutation operation
    await act(async () => {
      await wait();
    });

    expect(mockMutation[0].result).toBeCalledWith();
  });
});
