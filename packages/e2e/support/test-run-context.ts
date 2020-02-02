import { BrowserCapabilities } from './browser-capabilities';
import { WebDriver } from 'selenium-webdriver';
import { envConfig } from '../env-keys';
import {
  TestUser,
  Inbox,
  createTestUser,
  destroyTestUser,
  destroyUserByEmail,
  createNewInbox,
  deleteInbox,
  waitForVerificationCode,
} from '../utils/test-user';

export class TestRunContext {
  public static capabilities: BrowserCapabilities;
  public static browser: WebDriver;

  private static testUser: TestUser;
  private static inboxes: Inbox[] = [];

  public static setCapabilities(capabilities: BrowserCapabilities): void {
    this.capabilities = capabilities;
  }

  public static setBrowser(browser: WebDriver): void {
    this.browser = browser;
  }

  public static async createTestUser(): Promise<void> {
    if (!envConfig.TEST_USER) {
      this.testUser = await createTestUser();
    }
  }

  public static async destroyTestUsers(): Promise<void> {
    if (this.testUser) {
      await destroyTestUser(this.testUser);
    }

    for (const inbox of this.inboxes) {
      await deleteInbox(inbox.id);
      await destroyUserByEmail(inbox.address);
    }
  }

  public static getTestUser(): string {
    if (envConfig.TEST_USER) {
      return envConfig.TEST_USER;
    }

    return this.testUser.address;
  }

  public static async generateNewInbox(tag?: string) {
    const userInbox = await createNewInbox();
    this.inboxes.push({
      ...userInbox,
      tag,
    });

    return userInbox;
  }

  public static async waitForVerificationCode(inboxTag: string) {
    const inbox = this.inboxes.find(inbox => inbox.tag === inboxTag);

    if (!inbox) {
      throw Error(`Cannot find inbox for user ${inboxTag}`);
    }

    const code = await waitForVerificationCode(inbox.id);

    return code;
  }

  public static getUserEmail(inboxTag: string) {
    const inbox = this.inboxes.find(inbox => inbox.tag === inboxTag);

    if (!inbox) {
      throw Error(`Cannot find inbox for user ${inboxTag}`);
    }

    return inbox.address;
  }
}
