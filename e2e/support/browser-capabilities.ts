interface ChromeOptions {
  w3c: boolean;
}

export interface BrowserCapabilities {
  browserName: string;
  'goog:chromeOptions'?: ChromeOptions;
}

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
