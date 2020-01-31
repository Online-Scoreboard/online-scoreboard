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

        console.warn('Cognito user created', data);

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
