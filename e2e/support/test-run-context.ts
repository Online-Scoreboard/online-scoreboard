import { BrowserCapabilities } from './browser-capabilities';
import { WebDriver } from 'selenium-webdriver';

export class TestRunContext {
  static capabilities: BrowserCapabilities;
  static browser: WebDriver;
  static setCapabilities(capabilities: BrowserCapabilities): void {
    this.capabilities = capabilities;
  }
  static setBrowser(browser: WebDriver): void {
    this.browser = browser;
  }
}
