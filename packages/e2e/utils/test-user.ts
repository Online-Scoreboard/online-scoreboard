import { destroyInbox, createInbox } from './mail';
import { createUser, confirmUserPassword, destroyUser } from './aws';

export interface TestUser {
  address: string;
  id: string;
  cognitoUser: string;
}

export const createTestUser = async (): Promise<TestUser> => {
  console.warn('Creating a new test user...');

  let userInbox: { id: string; address: string };
  let cognitoUser: { User: { Username: string } };

  try {
    console.warn('Creating a new inbox for the user');
    userInbox = await createInbox();
    console.warn(`Test user inbox created: ${userInbox.address}`);
  } catch (err) {
    throw Error('Cannot proceed without creating a test user inbox');
  }

  try {
    console.warn('Creating a new Cognito user');
    cognitoUser = await createUser(userInbox.id, userInbox.address);
    console.warn('Cognito user created');

    console.warn('Confirming user password');
    await confirmUserPassword(userInbox.address);
    console.warn('Cognito user confirmed');
  } catch (err) {
    console.warn('\nDestroying user inbox');
    await destroyInbox(userInbox.address);

    console.warn(err.message || err);
    throw Error('Something went wrong');
  }

  if (userInbox) {
    return {
      ...userInbox,
      cognitoUser: cognitoUser.User.Username,
    };
  }

  throw Error('Cannot create a test user');
};

export const destroyTestUser = async (user: TestUser) => {
  try {
    console.warn('\nDestroying user inbox');
    await destroyInbox(user.id);
    console.warn('User inbox destroyed');

    console.warn('Destroying Cognito user');
    await destroyUser(user.cognitoUser);
    console.warn('Cognito user destroyed');
  } catch (err) {
    console.warn(err.message || err);
    throw Error('Something went wrong');
  }
};
