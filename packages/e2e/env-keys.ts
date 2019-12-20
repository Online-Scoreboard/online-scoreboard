import { config } from 'dotenv';

config();

export const envConfig = {
  HOMEPAGE_URL: process.env.HOMEPAGE_URL || 'http://localhost:3000',
  BROWSER: process.env.SELENIUM_BROWSER || 'chrome',
  VALID_USER: process.env.VALID_USER || '',
  VALID_PASSWORD: process.env.VALID_PASSWORD || '',
  INVALID_USER: 'invalid@user.com',
  INVALID_PASSWORD: 'password000',
};
