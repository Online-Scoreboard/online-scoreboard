import assert from 'assert';
import { until } from 'selenium-webdriver';
import { Given, Then, When } from 'cucumber';
import { envConfig } from '../env-keys';
import NavBarPage from '../pages/navbar.page';
import LoginPage from '../pages/login.page';
import DashboardPage from '../pages/dashboard.page';

When(/^I navigate to the Login page$/, async function() {
  await this.browser.wait(until.elementLocated(NavBarPage.loginButton())).click();
});

Then(/^I should see the Login page$/, async function() {
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
  const username = await this.browser.findElement(LoginPage.getUsernameInput());
  const password = await this.browser.findElement(LoginPage.getPasswordInput());
  const loginButton = await this.browser.findElement(LoginPage.getLoginButton());

  if (credentialsType === 'wrong') {
    await username.sendKeys(envConfig.INVALID_USER);
    await password.sendKeys(envConfig.INVALID_PASSWORD);
  } else {
    await username.sendKeys(envConfig.VALID_USER);
    await password.sendKeys(envConfig.VALID_PASSWORD);
  }

  await loginButton.click();
});

When(/^I am a logged in Online Scoreboard user$/, async function() {
  await LoginPage.navigateToLoginPage();
  await this.browser.wait(until.elementLocated(LoginPage.getUsernameInput())).isDisplayed();

  const username = this.browser.findElement(LoginPage.getUsernameInput());
  const password = this.browser.findElement(LoginPage.getPasswordInput());
  const loginButton = this.browser.findElement(LoginPage.getLoginButton());

  username.sendKeys(envConfig.VALID_USER);
  password.sendKeys(envConfig.VALID_PASSWORD);

  await loginButton.click();

  return this.browser.wait(until.elementLocated(DashboardPage.getWelcomeMessage())).isDisplayed();
});
