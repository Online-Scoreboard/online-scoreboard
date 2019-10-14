import { WebDriver } from 'selenium-webdriver';

declare module 'cucumber' {
  interface World {
    browser: WebDriver;
    attach: Function;
  }
}
