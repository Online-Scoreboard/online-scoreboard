import { By, until } from 'selenium-webdriver';
import { TestRunContext } from '../support/test-run-context';
import { envConfig } from '../env-keys';
import { deepStrictEqual } from 'assert';

export default class RegistrationPage {
  static readonly mainHeading = By.xpath(`//main/div/h2[text() = "Register"]`);
  static readonly usernameInput = By.css('input#username');
  static readonly verificationCodeInput = By.css('input#code');
  static readonly passwordInput = By.css('input#password');
  static readonly registerBtn = By.xpath('//button');
  static readonly verifyCodeBtn = By.xpath('//button');

  static navigateToRegistrationPage(): Promise<void> {
    return TestRunContext.browser.get(envConfig.HOMEPAGE_URL + '/register');
  }

  static async userIsOnRegistrationPage(): Promise<void> {
    /** wait for page navigation */
    await new Promise(r => setTimeout(r, 300));

    const urlRegister = '/register';
    await TestRunContext.browser.wait(until.urlContains(urlRegister), 5000, `Expected url path to be /register`);

    const h1 = await TestRunContext.browser.findElement(RegistrationPage.mainHeading).getText();
    deepStrictEqual(h1, 'Register', `Expected registration heading to be: Register, got: ${h1}`);
  }

  static async userSeesRegistrationForm(): Promise<void> {
    await TestRunContext.browser
      .wait(
        until.elementLocated(RegistrationPage.usernameInput),
        5000,
        'Could not find username input in Registration page'
      )
      .isDisplayed();

    await TestRunContext.browser
      .wait(
        until.elementLocated(RegistrationPage.passwordInput),
        5000,
        'Could not find password input in Registration page'
      )
      .isDisplayed();

    await TestRunContext.browser
      .wait(
        until.elementLocated(RegistrationPage.registerBtn),
        5000,
        'Could not find Register button in Registration page'
      )
      .isDisplayed();
  }
}
