import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MockedProvider } from '@apollo/react-testing';
import * as uniqueNamesGenerator from 'unique-names-generator';

import * as Auth from '../../hooks/Auth';
import { ProfileComponent } from './ProfileComponent';
import { Profile, SHUFFLE_AVATAR } from './Profile';

jest.mock('../../hooks/Auth');

describe('Profile', () => {
  const wait = (amount = 0) => new Promise(resolve => setTimeout(resolve, amount));
  let mockUserData = {};

  beforeEach(() => {
    jest.spyOn(Auth, 'useAuth').mockImplementation(() => {
      return {
        user: mockUserData,
      } as any;
    });
  });

  it('should render without crashing', () => {
    const profile = mount(
      <MockedProvider>
        <Profile />
      </MockedProvider>
    );

    expect(profile.find(ProfileComponent).exists()).toBe(true);
  });

  it('should render without crashing', async () => {
    const testAvatar = 'testAvatar';

    const testUser = {
      username: 'testUsername',
      avatar: testAvatar,
    };

    const mocks = [
      {
        request: {
          query: SHUFFLE_AVATAR,
          variables: {
            updateUserInput: { avatar: 'testAvatar' },
          },
        },
        result: jest.fn(() => {
          mockUserData = testUser;

          return {
            data: {
              updateUser: mockUserData,
            },
          };
        }),
      },
    ];

    jest.spyOn(uniqueNamesGenerator, 'uniqueNamesGenerator').mockImplementationOnce(() => {
      return testAvatar;
    });

    // Render the component
    const profile = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Profile />
      </MockedProvider>
    );

    // The first render should have an empty user and shuffleAvatarLoading should be false
    expect(profile.find(ProfileComponent).props().user).toEqual({});
    expect(profile.find(ProfileComponent).props().shuffleAvatarLoading).toBe(false);

    // Trigger the shuffleAvatar callback inside ProfileComponent
    act(() => {
      profile
        .find(ProfileComponent)
        .props()
        .shuffleAvatar();
    });

    // Trigger change detection in the component
    profile.update();

    // The graphql mutation should have been triggered, hence the shuffleAvatarLoading should be true
    expect(profile.find(ProfileComponent).props().shuffleAvatarLoading).toBe(true);

    // Simulate the end of the mutation operation
    await act(async () => {
      await wait();
    });
    profile.update();

    // The user should be updated and shuffleAvatarLoading should be back to false
    expect(mocks[0].result).toBeCalled();
    expect(profile.find(ProfileComponent).length).toBe(1);
    expect(profile.find(ProfileComponent).props().user).toBe(testUser);
    expect(profile.find(ProfileComponent).props().shuffleAvatarLoading).toBe(false);
  });
});
