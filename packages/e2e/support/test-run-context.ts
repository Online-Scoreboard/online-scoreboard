import { BrowserCapabilities } from './browser-capabilities';
import { WebDriver } from 'selenium-webdriver';
import { TestUser, createTestUser, destroyTestUser } from '../utils/test-user';

export class TestRunContext {
  public static capabilities: BrowserCapabilities;
  public static browser: WebDriver;

  private static testUser: TestUser;

  public static setCapabilities(capabilities: BrowserCapabilities): void {
    this.capabilities = capabilities;
  }

  public static setBrowser(browser: WebDriver): void {
    this.browser = browser;
  }

  public static async createTestUser(): Promise<void> {
    this.testUser = await createTestUser();
  }

  public static async destroyTestUser(): Promise<void> {
    await destroyTestUser(this.testUser);
  }

  public static getTestUser(): TestUser {
    return this.testUser;
  }
}
