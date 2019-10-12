import { WebDriver } from 'selenium-webdriver';

declare module 'cucumber' {
  interface World {
    browser: WebDriver;
    attach: Function;
  }
}

interface ChromeOptions {
  w3c: boolean;
}

export interface BrowserCapabilities {
  browserName: string;
  'goog:chromeOptions'?: ChromeOptions;
}
