import { When, Then } from 'cucumber';
import { until } from 'selenium-webdriver';
import RegistrationPage from '../pages/registration.page';
import assert from 'assert';
import LoginPage from '../pages/login.page';

When(/^I navigate to 'Registration' page$/, async function() {
  await this.browser.wait(until.elementLocated(LoginPage.doNotHaveAccountButton())).click();
});

Then(/^I should see 'Registration' page$/, async function() {
  const h1 = await this.browser.findElement(RegistrationPage.getMainHeading()).getText();
  assert.deepStrictEqual(h1, 'Register', `Expected registration heading to be: Register, got: ${h1}`);
});

Then(/^I should see registration form$/, async function() {
  await this.browser.wait(until.elementLocated(RegistrationPage.getUsernameInput())).isDisplayed();
  await this.browser.wait(until.elementLocated(RegistrationPage.getPasswordInput())).isDisplayed();
  await this.browser.wait(until.elementLocated(RegistrationPage.getLoginButton())).isDisplayed();
});
