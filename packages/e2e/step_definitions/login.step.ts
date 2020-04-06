import { until } from 'selenium-webdriver';
import { Given, Then, When } from 'cucumber';
import NavBarPage from '../pages/NavBarPage';
import LoginPage from '../pages/LoginPage';
import NewGamePage from '../pages/NewGamePage';
import GenericPage from '../pages/GenericPage';

When(/^I navigate to the Login page$/, async function() {
  await this.browser.wait(until.elementLocated(NavBarPage.logInBtn)).click();
});

Then(/^I should see the Login page$/, async function() {
  await LoginPage.userIsOnLoginPage();
});

Then(/^I should see login form$/, async function() {
  await LoginPage.userSeesLoginForm();
});

Given(/^I am on the login page$/, async function() {
  await LoginPage.navigateToLoginPage();
  await LoginPage.userIsOnLoginPage();
  await LoginPage.userSeesLoginForm();
});

Then(/^I enter '(.*)' login credentials$/, async function(credentialsType: string) {
  await LoginPage.userEntersCredentials(credentialsType);
});

When(/^I am logged in$/, async function() {
  await LoginPage.logInAsUser();
});

When(/^I am logged in and on '(.*)' view$/, async function(view: string) {
  await LoginPage.logInAsUser();

  if (view === '/new-game') {
    await NewGamePage.navigateToNewGame();
  }

  await GenericPage.waitForUrlToMatch(view);

  if (view === '/new-game') {
    await NewGamePage.newGameViewVisible();
  }
});
