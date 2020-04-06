import { until } from 'selenium-webdriver';
import { TestRunContext } from '../support/test-run-context';

export default class GenericPage {
  static async waitForUrlToMatch(path: string) {
    /** Wait for page navigation */
    await new Promise(r => setTimeout(r, 300));

    await TestRunContext.browser.wait(until.urlContains(path), 5000, `Expected url path to be ${path}`);
  }
}
