import { By } from 'selenium-webdriver';
import { TestRunContext } from '../support/test-run-context';
import { envConfig } from '../env-keys';

export default class LoginPage {
  public static getMainHeading(): By {
    return By.css(`div > h1`);
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
  public static navigateToLoginPage(): Promise<void> {
    return TestRunContext.browser.get(envConfig.HOMEPAGE_URL + '/login');
  }
  public static doNotHaveAccountButton(): By {
    return By.xpath(`//span[contains(text(), 'have an account? Sign Up')]`);
  }
}
