import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import { act } from 'react-dom/test-utils';

import { Component as NewGameComponent } from './NewGameComponent';
import { NewGameWrapper as NewGame } from './NewGame';
import { NEW_GAME } from './NewGame.graphql';

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
    const mockGameId = 's';

    const mockMutation = [
      {
        request: {
          query: NEW_GAME,
          variables: {
            createGameInput: { id: mockGameId },
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
      newGameComponent.prop('newGame')();
    });
    newGame.update();

    // Simulate the end of the mutation operation
    await act(async () => {
      await wait();
    });

    expect(mockMutation[0].result).toBeCalledWith();
  });
});
