import assert from 'assert';
import { until } from 'selenium-webdriver';
import { When, Then } from 'cucumber';
import { TestRunContext } from '../support/test-run-context';
import RegistrationPage from '../pages/registration.page';
import LoginPage from '../pages/login.page';
import { envConfig } from '../env-keys';

When(/^I am on the Online Scoreboard registration form$/, async function() {
  await RegistrationPage.navigateToRegistrationPage();

  const expected = 'Register';
  const h1 = await this.browser.findElement(RegistrationPage.getMainHeading()).getText();

  assert.deepStrictEqual(h1, expected, `Expected registration page heading to be: ${expected}, got: ${h1}`);
});

When(/^I navigate to the Registration page$/, async function() {
  await this.browser.wait(until.elementLocated(LoginPage.doNotHaveAccountButton())).click();
});

Then(/^I should see the Registration page$/, async function() {
  await new Promise(r => setTimeout(r, 300)); // wait for page navigation
  const urlRegister = '/register';
  await this.browser.wait(until.urlContains(urlRegister), 5000, `Expected url path to be /register`);

  const h1 = await this.browser.findElement(RegistrationPage.getMainHeading()).getText();
  assert.deepStrictEqual(h1, 'Register', `Expected registration heading to be: Register, got: ${h1}`);
});

Then(/^I should see the registration form$/, async function() {
  await this.browser.wait(until.elementLocated(RegistrationPage.getUsernameInput())).isDisplayed();
  await this.browser.wait(until.elementLocated(RegistrationPage.getPasswordInput())).isDisplayed();
  await this.browser.wait(until.elementLocated(RegistrationPage.getRegisterButton())).isDisplayed();
});

Then(/^The user '(.*)' should receive an email containing the verification code$/, async function(inboxId: string) {
  const codeInput = await this.browser.findElement(RegistrationPage.getVerificationCodeInput());
  const verifyCodeButton = await this.browser.findElement(RegistrationPage.getVerifyCodeButton());

  const code = await TestRunContext.waitForVerificationCode(inboxId);

  await codeInput.sendKeys(code);
  await verifyCodeButton.click();
});

Then(/^I should see the email verification form$/, async function() {
  await this.browser.wait(until.elementLocated(RegistrationPage.getVerificationCodeInput())).isDisplayed();
  await this.browser.wait(until.elementLocated(RegistrationPage.getVerifyCodeButton())).isDisplayed();
});

Then(/^I fill in the registration form with '(.*)' email address and '(.*)' password for user '(.*)'$/, async function(
  isValidEmail: string,
  isValidPassword: string,
  userTag?: string
) {
  const username = await this.browser.findElement(RegistrationPage.getUsernameInput());
  const password = await this.browser.findElement(RegistrationPage.getPasswordInput());
  const registerButton = await this.browser.findElement(RegistrationPage.getRegisterButton());

  if (isValidEmail === 'valid') {
    const inbox = await TestRunContext.generateNewInbox(userTag);

    await username.sendKeys(inbox.address);
  } else if (isValidEmail === 'existing') {
    await username.sendKeys(TestRunContext.getTestUser().address);
  } else {
    await username.sendKeys('invalidEmailAddress');
  }

  if (isValidPassword === 'valid') {
    await password.sendKeys(envConfig.VALID_PASSWORD);
  } else {
    await password.sendKeys('12345');
  }

  await registerButton.click();
});
