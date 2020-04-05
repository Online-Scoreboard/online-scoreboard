import { until } from 'selenium-webdriver';
import { When, Then } from 'cucumber';
import { TestRunContext } from '../support/test-run-context';
import RegistrationPage from '../pages/RegistrationPage';
import LoginPage from '../pages/LoginPage';
import { envConfig } from '../env-keys';
import { deepStrictEqual } from 'assert';

When(/^I am on the registration page$/, async function() {
  // navigate to page, see page, see form
  await RegistrationPage.navigateToRegistrationPage();
  await RegistrationPage.userIsOnRegistrationPage();
  await RegistrationPage.userSeesRegistrationForm();
});

When(/^I navigate to the Registration page$/, async function() {
  await this.browser.wait(until.elementLocated(LoginPage.doNotHaveAccountBtn)).click();
});

Then(/^I should see the Registration page$/, async function() {
  await RegistrationPage.userIsOnRegistrationPage();
});

Then(/^I should see the registration form$/, async function() {
  await RegistrationPage.userSeesRegistrationForm();
});

Then(/^The user '(.*)' should receive an email containing the verification code$/, async function(inboxId: string) {
  const codeInput = await this.browser.findElement(RegistrationPage.verificationCodeInput);
  const verifyCodeButton = await this.browser.findElement(RegistrationPage.verifyCodeBtn);

  const code = await TestRunContext.waitForVerificationCode(inboxId);

  await codeInput.sendKeys(code);
  await verifyCodeButton.click();
});

Then(/^I should see the email verification form$/, async function() {
  await this.browser
    .wait(
      until.elementLocated(RegistrationPage.verificationCodeInput),
      5000,
      'Could not find Verification code input in Registration page'
    )
    .isDisplayed();

  await this.browser
    .wait(
      until.elementLocated(RegistrationPage.verifyCodeBtn),
      5000,
      'Could not find Verify code button in Registration page'
    )
    .isDisplayed();
});

Then(/^I fill in the registration form with '(.*)' email address and '(.*)' password for user '(.*)'$/, async function(
  isValidEmail: string,
  isValidPassword: string,
  userTag?: string
) {
  const username = await this.browser.findElement(RegistrationPage.usernameInput);
  const password = await this.browser.findElement(RegistrationPage.passwordInput);
  const registerButton = await this.browser.findElement(RegistrationPage.registerBtn);

  if (isValidEmail === 'valid') {
    const inbox = await TestRunContext.generateNewInbox(userTag);

    await username.sendKeys(inbox.address);
  } else if (isValidEmail === 'existing') {
    await username.sendKeys(TestRunContext.getTestUser());
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
