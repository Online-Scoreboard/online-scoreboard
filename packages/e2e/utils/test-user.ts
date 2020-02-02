import { destroyInbox, createInbox, waitForLatestEmail, getVerificationCode } from './mail';
import { createUser, confirmUserPassword, destroyUser, destroyCognitoUserByEmail } from './aws';

export interface TestUser {
  address: string;
  id: string;
  cognitoUser: string;
}

export interface Inbox {
  id: string;
  address: string;
  tag?: string;
}

export const createNewInbox = async (): Promise<Inbox> => {
  let inbox: Inbox;

  try {
    console.warn('\nCreating a new email inbox...');
    inbox = await createInbox();
    console.warn(`\nEmail inbox created: ${inbox.address}`);
  } catch (err) {
    throw Error('Cannot create a new email inbox');
  }

  return inbox;
};

export const deleteInbox = async (inboxId: string) => {
  try {
    console.warn(`\nDestroying user inbox ${inboxId}`);
    await destroyInbox(inboxId);
    console.warn('\nUser inbox destroyed');
  } catch (err) {
    console.warn(err.message || err);
  }
};

export const createTestUser = async (): Promise<TestUser> => {
  console.warn('\nCreating a new test user...');
  const userInbox = await createNewInbox();

  let cognitoUser: { User: { Username: string } };
  try {
    console.warn('\nCreating a new Cognito user');
    cognitoUser = await createUser(userInbox.address);
    console.warn('\nCognito user created');

    console.warn('\nConfirming user password');
    await confirmUserPassword(userInbox.address);
    console.warn('\nCognito user confirmed');
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
  await deleteInbox(user.id);

  try {
    console.warn('\nDestroying Cognito user');
    await destroyUser(user.cognitoUser);
    console.warn('\nCognito user destroyed');
  } catch (err) {
    console.warn(err.message || err);
    throw Error('Something went wrong');
  }
};

export const destroyUserByEmail = async (email: string) => {
  try {
    await destroyCognitoUserByEmail(email);
  } catch (err) {
    console.warn(err.message || err);
  }
};

export const waitForVerificationCode = async (inboxId: string): Promise<string> => {
  let code;
  try {
    const email = await waitForLatestEmail(inboxId);
    code = await getVerificationCode(email);
  } catch (err) {
    throw Error(err.message || err);
  }

  if (!code) {
    throw Error('Verification code not received');
  }

  return code;
};
