export const envConfig = {
  HOMEPAGE_URL: process.env.HOMEPAGE_URL || 'http://localhost:3000',
  BROWSER: process.env.SELENIUM_BROWSER || 'chrome',
  SELENIUM_URL: process.env.SELENIUM_SERVER_URL || 'http://localhost:4444/wd/hub',
};
