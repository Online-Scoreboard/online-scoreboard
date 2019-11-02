import { BrowserCapabilities } from './browser-capabilities';
import { WebDriver } from 'selenium-webdriver';

export class TestRunContext {
  public static capabilities: BrowserCapabilities;
  public static browser: WebDriver;
  public static setCapabilities(capabilities: BrowserCapabilities): void {
    this.capabilities = capabilities;
  }
  public static setBrowser(browser: WebDriver): void {
    this.browser = browser;
  }
}
