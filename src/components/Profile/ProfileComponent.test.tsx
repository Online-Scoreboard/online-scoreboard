import React from 'react';
import { shallow, mount } from 'enzyme';
import { Avatar } from 'react-avataaars';
import { CircularProgress } from '@material-ui/core';

import { User } from '../../hooks/Auth';
import { Classes } from './Profile.styles';
import { ProfileComponent } from './ProfileComponent';

/* eslint-disable @typescript-eslint/consistent-type-assertions */
describe('ProfileComponent', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('should render without crashing', () => {
    const mockUser = {} as any;
    const shuffleAvatar = jest.fn();
    const saveUsername = jest.fn();
    const shuffleAvatarLoading = false;
    const saveUsernameLoading = false;
    const classes = {} as Classes;

    shallow(
      <ProfileComponent
        shuffleAvatar={shuffleAvatar}
        saveUsername={saveUsername}
        shuffleAvatarLoading={shuffleAvatarLoading}
        saveUsernameLoading={saveUsernameLoading}
        user={mockUser}
        classes={classes}
      />
    );

    expect(true).toBeTruthy();
  });

  it('should display an avatar', () => {
    const testAvatar = 'testAvatar';
    const mockUser = {
      avatar: testAvatar,
    } as User;
    const shuffleAvatar = jest.fn();
    const saveUsername = jest.fn();
    const shuffleAvatarLoading = false;
    const saveUsernameLoading = false;
    const classes = {} as Classes;

    const wrapper = shallow(
      <ProfileComponent
        shuffleAvatar={shuffleAvatar}
        saveUsername={saveUsername}
        shuffleAvatarLoading={shuffleAvatarLoading}
        saveUsernameLoading={saveUsernameLoading}
        user={mockUser}
        classes={classes}
      />
    );

    expect(wrapper.find(Avatar).exists()).toBe(true);
    expect(wrapper.find(Avatar).props().hash).toBe(testAvatar);
  });

  it('should display the current user name', () => {
    const testUsername = 'testUsername';
    const mockUser = {
      username: testUsername,
    } as User;
    const shuffleAvatar = jest.fn();
    const saveUsername = jest.fn();
    const shuffleAvatarLoading = false;
    const saveUsernameLoading = false;
    const classes = {} as Classes;

    const wrapper = shallow(
      <ProfileComponent
        shuffleAvatar={shuffleAvatar}
        saveUsername={saveUsername}
        shuffleAvatarLoading={shuffleAvatarLoading}
        saveUsernameLoading={saveUsernameLoading}
        user={mockUser}
        classes={classes}
      />
    );

    expect(wrapper.find('.username').exists()).toBe(true);
    expect(wrapper.find('.username').props().value).toBe(testUsername);
  });

  it('should update the username when interacting with the input field', () => {
    const testUsername = 'testUsername';
    const mockUser = {
      username: testUsername,
    } as User;
    const shuffleAvatar = jest.fn();
    const saveUsername = jest.fn();
    const shuffleAvatarLoading = false;
    const saveUsernameLoading = false;
    const classes = {} as Classes;

    const wrapper = shallow(
      <ProfileComponent
        shuffleAvatar={shuffleAvatar}
        saveUsername={saveUsername}
        shuffleAvatarLoading={shuffleAvatarLoading}
        saveUsernameLoading={saveUsernameLoading}
        user={mockUser}
        classes={classes}
      />
    );

    expect(wrapper.find('.username').props().value).toBe(testUsername);

    wrapper.find('.username').simulate('change', { target: { value: 20 } });

    wrapper.update();

    // expect(wrapper.find('.username').props().value).toBe(testUsername);
  });

  it('should invoke a shuffleAvatar callback', () => {
    const mockUser = {} as User;
    const shuffleAvatar = jest.fn();
    const saveUsername = jest.fn();
    const shuffleAvatarLoading = false;
    const classes = {} as Classes;
    const saveUsernameLoading = false;

    const wrapper = shallow(
      <ProfileComponent
        shuffleAvatar={shuffleAvatar}
        saveUsername={saveUsername}
        shuffleAvatarLoading={shuffleAvatarLoading}
        saveUsernameLoading={saveUsernameLoading}
        user={mockUser}
        classes={classes}
      />
    );

    wrapper.find('.shuffleAvatar').simulate('click');

    expect(shuffleAvatar).toBeCalled();
  });

  it('should invoke a setUsername callback', () => {
    const mockUser = {} as User;
    const shuffleAvatar = jest.fn();
    const saveUsername = jest.fn();
    const shuffleAvatarLoading = false;
    const classes = {} as Classes;
    const saveUsernameLoading = false;

    const wrapper = shallow(
      <ProfileComponent
        shuffleAvatar={shuffleAvatar}
        saveUsername={saveUsername}
        shuffleAvatarLoading={shuffleAvatarLoading}
        saveUsernameLoading={saveUsernameLoading}
        user={mockUser}
        classes={classes}
      />
    );

    wrapper.find('.saveUsername').simulate('click');

    expect(saveUsername).toBeCalled();
  });

  it('should display a loading spinner when a new avatar is loading', async () => {
    const mockUser = {} as User;
    const shuffleAvatar = jest.fn();
    const saveUsername = jest.fn();
    const shuffleAvatarLoading = true;
    const saveUsernameLoading = false;
    const classes = {} as Classes;

    const wrapper = mount(
      <ProfileComponent
        shuffleAvatar={shuffleAvatar}
        saveUsername={saveUsername}
        shuffleAvatarLoading={shuffleAvatarLoading}
        saveUsernameLoading={saveUsernameLoading}
        user={mockUser}
        classes={classes}
      />
    );

    let button = wrapper.find('.shuffleAvatar');

    expect(button.find(CircularProgress).exists()).toBe(true);

    wrapper.setProps({ shuffleAvatarLoading: false });

    button = wrapper.find('.shuffleAvatar');

    expect(button.find(CircularProgress).exists()).toBe(false);
  });

  it('should display a loading spinner when the username is saving', async () => {
    const mockUser = {} as User;
    const shuffleAvatar = jest.fn();
    const saveUsername = jest.fn();
    const shuffleAvatarLoading = false;
    const saveUsernameLoading = true;
    const classes = {} as Classes;

    const wrapper = mount(
      <ProfileComponent
        shuffleAvatar={shuffleAvatar}
        saveUsername={saveUsername}
        shuffleAvatarLoading={shuffleAvatarLoading}
        saveUsernameLoading={saveUsernameLoading}
        user={mockUser}
        classes={classes}
      />
    );

    let button = wrapper.find('.saveUsername');

    expect(button.find(CircularProgress).exists()).toBe(true);

    wrapper.setProps({ saveUsernameLoading: false });

    button = wrapper.find('.saveUsername');

    expect(button.find(CircularProgress).exists()).toBe(false);
  });
});
