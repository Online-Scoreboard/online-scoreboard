import { config } from 'dotenv';

config();

export const envConfig = {
  USER_POOL_ID: process.env.USER_POOL_ID || '',
  HOMEPAGE_URL: process.env.HOMEPAGE_URL || 'http://localhost:3000',
  BROWSER: process.env.SELENIUM_BROWSER || 'chrome',
  VALID_PASSWORD: process.env.VALID_PASSWORD || '',
  INVALID_USER: 'invalid@user.com',
  INVALID_PASSWORD: 'password000',
  MAILSLURP_API_KEY: process.env.MAILSLURP_API_KEY || '',
  TEST_USER: process.env.TEST_USER || '',
};
