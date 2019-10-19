import gql from 'graphql-tag';

export const GET_USER = gql`
  query GetUser {
    user @client {
      isLoggedIn
      confirmEmail
      resetPassword
      email
      error
      info
    }
  }
`;

export const GET_USER_DATA = gql`
  query GetUserData {
    whoAmI {
      id
      avatar
      username
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser {
    createUser {
      id
    }
  }
`;

export const RESET_ERRORS = gql`
  mutation ResetErrors {
    resetErrors @client
  }
`;

export const LOG_IN = gql`
  mutation LogIn($loginData: LogInData!) {
    logIn(loginData: $loginData) @client
  }
`;

export const LOG_OUT = gql`
  mutation LogOut {
    logOut @client
  }
`;

export const REGISTER = gql`
  mutation Register($registerData: RegisterData!) {
    register(registerData: $registerData) @client
  }
`;

export const VERIFY_EMAIL = gql`
  mutation VerifyEmail($verifyEmailData: VerifyEmailData!) {
    verifyEmail(verifyEmailData: $verifyEmailData) @client
  }
`;

export const RESEND_CODE = gql`
  mutation ResendCode {
    resendCode @client
  }
`;

export const FORGOTTEN_PASSWORD = gql`
  mutation ForgottenPassword($forgottenPasswordData: ForgottenPasswordData!) {
    forgottenPassword(forgottenPasswordData: $forgottenPasswordData) @client
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($resetPasswordData: ResetPasswordData!) {
    resetPassword(resetPasswordData: $resetPasswordData) @client
  }
`;

export const SHUFFLE_AVATAR = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(input: $updateUserInput) {
      username
      avatar
    }
  }
`;
