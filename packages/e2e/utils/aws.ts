import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { envConfig } from '../env-keys';

const cognitoidentity = new CognitoIdentityServiceProvider({ region: 'us-east-1' });
const UserPoolId = envConfig.USER_POOL_ID;

export const createUser = async (email: string): Promise<any> => {
  return new Promise(res => {
    cognitoidentity.adminCreateUser(
      {
        UserPoolId,
        Username: email,
        TemporaryPassword: envConfig.VALID_PASSWORD,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'email_verified', Value: 'true' },
        ],
      },
      (err, data) => {
        if (err) {
          throw Error(err.message);
        }

        console.warn('\nCognito user created', data);

        return res(data);
      }
    );
  });
};

export const confirmUserPassword = async (email: string) => {
  return new Promise((res, rej) => {
    cognitoidentity.adminSetUserPassword(
      {
        UserPoolId,
        Username: email,
        Password: envConfig.VALID_PASSWORD,
        Permanent: true,
      },
      (err, data) => {
        if (err) {
          return rej(err.message);
        }

        return res(data);
      }
    );
  });
};

export const destroyUser = (username: string) => {
  return new Promise((res, rej) => {
    cognitoidentity.adminDeleteUser(
      {
        UserPoolId,
        Username: username,
      },
      (err, data) => {
        if (err) {
          return rej(err.message);
        }

        return res(data);
      }
    );
  });
};

export const findUserByEmail = (email: string): Promise<string> => {
  return new Promise(res => {
    cognitoidentity.listUsers(
      {
        UserPoolId,
        Filter: `email = \"${email}\"`,
      },
      (err, data) => {
        if (err) {
          console.warn(err.message || err);
          return res();
        }

        if (data.Users && data.Users.length && data.Users[0].Username) {
          return res(data.Users[0].Username);
        }
        res();
      }
    );
  });
};

export const destroyCognitoUserByEmail = async (email: string) => {
  console.log(`\nSearching for Cognito user matching email: ${email}`);
  const user = await findUserByEmail(email);
  console.log(`\nCognito user found: ${user}`);

  if (user) {
    console.log(`\nDestroying Cognito user: ${user}`);
    await destroyUser(user);
    console.log(`\nCognito user destroyed`);
  }
};
