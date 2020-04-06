import { By, until } from 'selenium-webdriver';
import { TestRunContext } from '../support/test-run-context';
import { envConfig } from '../env-keys';
import HomePage from './HomePage';
import { deepStrictEqual } from 'assert';

export default class LoginPage {
  static readonly mainHeading = By.xpath(`//main/div/h2[text() = "Log In"]`);
  static readonly usernameInput = By.css('input#username');
  static readonly passwordInput = By.css('input#password');
  static readonly logInBtn = By.xpath('//button');
  static readonly doNotHaveAccountBtn = By.xpath(`//span[contains(text(), 'have an account? Sign Up')]`);

  static navigateToLoginPage(): Promise<void> {
    return TestRunContext.browser.get(envConfig.HOMEPAGE_URL + '/login');
  }

  static async userIsOnLoginPage(): Promise<void> {
    /** Wait for page navigation */
    await new Promise(r => setTimeout(r, 300));

    const urlLogin = '/login';
    await TestRunContext.browser.wait(until.urlContains(urlLogin), 5000, `Expected url path to be /login`);

    const expected = 'Log In';
    const h1 = await TestRunContext.browser.findElement(LoginPage.mainHeading).getText();
    deepStrictEqual(h1, expected, `Expected login page heading to be: Log In, got: ${h1}`);
  }

  static async userSeesLoginForm(): Promise<void> {
    await TestRunContext.browser
      .wait(until.elementLocated(LoginPage.usernameInput), 5000, 'Could not find username input in Login page')
      .isDisplayed();

    await TestRunContext.browser
      .wait(until.elementLocated(LoginPage.passwordInput), 5000, 'Could not find password input in Login page')
      .isDisplayed();

    await TestRunContext.browser
      .wait(until.elementLocated(LoginPage.logInBtn), 5000, 'Could not find login button in Login page')
      .isDisplayed();
  }

  static async userEntersCredentials(type: string): Promise<void> {
    const username = await TestRunContext.browser.findElement(this.usernameInput);
    const password = await TestRunContext.browser.findElement(this.passwordInput);
    const loginButton = await TestRunContext.browser.findElement(this.logInBtn);

    if (type === 'wrong') {
      await username.sendKeys(envConfig.INVALID_USER);
      await password.sendKeys(envConfig.INVALID_PASSWORD);
    } else if (type === 'correct') {
      await username.sendKeys(TestRunContext.getTestUser());
      await password.sendKeys(envConfig.VALID_PASSWORD);
    } else {
      const email = TestRunContext.getUserEmail(type);
      await username.sendKeys(email);
      await password.sendKeys(envConfig.VALID_PASSWORD);
    }

    await loginButton.click();
  }

  static async logInAsUser(): Promise<void> {
    await this.navigateToLoginPage();
    await this.userIsOnLoginPage();
    await this.userSeesLoginForm();
    await this.userEntersCredentials('correct');

    await TestRunContext.browser
      .wait(until.elementLocated(HomePage.welcomeMessage), 5000, 'Could not find Welcome Message in Home page')
      .isDisplayed();
  }
}
