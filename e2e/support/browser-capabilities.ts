import { BrowserCapabilities } from '../typings';

export const getBrowserCapabilities = (browserName: string): BrowserCapabilities => {
  switch (browserName) {
    case 'chrome':
      return {
        browserName: browserName,
        'goog:chromeOptions': { w3c: true },
      };
    case 'firefox': {
      return {
        browserName: browserName,
      };
    }
    default:
      throw new Error(`Browser options for browser: ${browserName} are not specified`);
  }
};
