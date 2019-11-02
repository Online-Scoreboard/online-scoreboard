import { By } from 'selenium-webdriver';
import { TestRunContext } from '../support/test-run-context';
import { envConfig } from '../env-keys';

export default class RegistrationPage {
  public static getMainHeading(): By {
    return By.css(`div > h1`);
  }
  public static navigateToRegistrationPage(): Promise<void> {
    return TestRunContext.browser.get(envConfig.HOMEPAGE_URL + '/register');
  }
  public static getUsernameInput(): By {
    return By.css('input#username');
  }
  public static getPasswordInput(): By {
    return By.css('input#password');
  }
  public static getLoginButton(): By {
    return By.xpath('//button');
  }
}
