import { By } from 'selenium-webdriver';
import { TestRunContext } from '../support/test-run-context';
import { envConfig } from '../env-keys';
import { deepStrictEqual } from 'assert';
import { HOMEPAGE_TITLE } from '../support/const';

export default class HomePage {
  static readonly mainHeading = By.css(`h1`);
  static readonly notification = By.css('.NotificationBar');
  static readonly notificationMessage = By.css('.NotificationBar .NotificationBarMessage');
  static readonly welcomeMessage = By.css('h2.welcome');

  static navigateToHomepage(): Promise<void> {
    return TestRunContext.browser.get(envConfig.HOMEPAGE_URL);
  }
  static async userIsOnHomePage(): Promise<void> {
    /** Wait for page navigation */
    await new Promise(r => setTimeout(r, 300));

    const actualTitle = await TestRunContext.browser.getTitle();
    deepStrictEqual(
      actualTitle,
      HOMEPAGE_TITLE,
      `Titles did not match. Expected: ${HOMEPAGE_TITLE}, got: ${actualTitle}`
    );

    const h1 = await TestRunContext.browser.findElement(HomePage.mainHeading).getText();
    deepStrictEqual(h1, HOMEPAGE_TITLE, `Expected homepage heading to be: ${HOMEPAGE_TITLE}, got: ${h1}`);
  }
}
