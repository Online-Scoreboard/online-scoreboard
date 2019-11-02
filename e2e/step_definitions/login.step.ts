import { Given, Then, When } from 'cucumber';
import { until } from 'selenium-webdriver';
import NavBarPage from '../pages/navbar.page';
import LoginPage from '../pages/login.page';
import assert from 'assert';

When(/^I navigate to 'Login' page$/, async function() {
  await this.browser.wait(until.elementLocated(NavBarPage.loginButton())).click();
});

Then(/^I should see 'Login' page$/, async function() {
  await new Promise(r => setTimeout(r, 300)); // wait for page navigation
  const urlLogin = '/login';
  await this.browser.wait(until.urlContains(urlLogin), 5000, `Expected url path to be /login`);

  const expected = 'Log In';
  const h1 = await this.browser.findElement(LoginPage.getMainHeading()).getText();
  assert.deepStrictEqual(h1, expected, `Expected login page heading to be: Log In, got: ${h1}`);
});

Then(/^I should see login form$/, async function() {
  await this.browser.wait(until.elementLocated(LoginPage.getUsernameInput())).isDisplayed();
  await this.browser.wait(until.elementLocated(LoginPage.getPasswordInput())).isDisplayed();
  await this.browser.wait(until.elementLocated(LoginPage.getLoginButton())).isDisplayed();
});

Given(/^I am on the Online Scoreboard login form$/, async function() {
  await LoginPage.navigateToLoginPage();
  const expected = 'Log In';
  const h1 = await this.browser.findElement(LoginPage.getMainHeading()).getText();
  assert.deepStrictEqual(h1, expected, `Expected login page heading to be: Log In, got: ${h1}`);
});
