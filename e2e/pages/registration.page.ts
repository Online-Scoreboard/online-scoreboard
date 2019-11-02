import { By } from 'selenium-webdriver';
import { TestRunContext } from '../support/test-run-context';
import { envConfig } from '../env-keys';

export default class RegistrationPage {
  static getMainHeading(): By {
    return By.css(`div > h1`);
  }
  static navigateToRegistrationPage(): Promise<void> {
    return TestRunContext.browser.get(envConfig.HOMEPAGE_URL + '/register');
  }
  static getUsernameInput(): By {
    return By.css('input#username');
  }
  static getPasswordInput(): By {
    return By.css('input#password');
  }
  static getLoginButton(): By {
    return By.xpath('//button');
  }
}
