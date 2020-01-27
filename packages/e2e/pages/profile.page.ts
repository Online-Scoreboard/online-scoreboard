import { By } from 'selenium-webdriver';
import { TestRunContext } from '../support/test-run-context';
import { envConfig } from '../env-keys';

export default class HomePage {
  public static navigateToProfile(): Promise<void> {
    return TestRunContext.browser.get(`${envConfig.HOMEPAGE_URL}/profile`);
  }

  public static getPageTitle(): By {
    return By.css(`h1`);
  }

  public static getForm(form: string): By {
    if (form === 'username') {
      return By.css(`#card-username span.MuiCardHeader-title`);
    }

    return By.css(`#card-avatar span.MuiCardHeader-title`);
  }
}
