import { By } from 'selenium-webdriver';
import { TestRunContext } from '../support/test-run-context';
import { envConfig } from '../env-keys';

export default class RegistrationPage {
  public static getMainHeading(): By {
    return By.xpath(`//main/div/h2[text() = "Register"]`);
  }
  public static navigateToRegistrationPage(): Promise<void> {
    return TestRunContext.browser.get(envConfig.HOMEPAGE_URL + '/register');
  }
  public static getUsernameInput(): By {
    return By.css('input#username');
  }
  public static getVerificationCodeInput(): By {
    return By.css('input#code');
  }
  public static getPasswordInput(): By {
    return By.css('input#password');
  }
  public static getRegisterButton(): By {
    return By.xpath('//button');
  }
  public static getVerifyCodeButton(): By {
    return By.xpath('//button');
  }
}
