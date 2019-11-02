import { By } from 'selenium-webdriver';
import { TestRunContext } from '../support/test-run-context';
import { envConfig } from '../env-keys';

export default class HomePage {
  public static getMainHeading(): By {
    return By.css(`div > h1`);
  }
  public static navigateToHomepage(): Promise<void> {
    return TestRunContext.browser.get(envConfig.HOMEPAGE_URL);
  }
}
