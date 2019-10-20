export interface User {
  __typename: string;
  isLoggedIn: boolean;
  confirmEmail: boolean;
  resetPassword: boolean;
  username: string;
  email: string;
  error: string;
  info: string;
  avatar?: string;
  id?: string;
}
