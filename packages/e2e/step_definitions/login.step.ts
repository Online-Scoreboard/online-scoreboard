import assert from 'assert';
import { until } from 'selenium-webdriver';
import { Given, Then, When } from 'cucumber';
import NavBarPage from '../pages/navbar.page';
import LoginPage from '../pages/login.page';

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

Then(/^I enter '(.*)' login credentials$/, async function(credentialsType: string) {
  const username = this.browser.findElement(LoginPage.getUsernameInput());
  const password = this.browser.findElement(LoginPage.getPasswordInput());
  const loginButton = this.browser.findElement(LoginPage.getLoginButton());

  if (credentialsType === 'wrong') {
    username.sendKeys('fake@email.com');
    password.sendKeys('fakePassword');
  } else {
    username.sendKeys('validUser@email.com');
    password.sendKeys('Passw0rd123!');
  }

  loginButton.click();
});
