import { equal } from 'assert';
import { until } from 'selenium-webdriver';
import { Given, Then, When } from 'cucumber';
import { hasClassName } from '../utils';
import HomePage from '../pages/HomePage';

Given(/^I am on the homepage$/, async function() {
  await HomePage.navigateToHomepage();
  await HomePage.userIsOnHomePage();
});

Then(/^I should be on the homepage$/, async function() {
  await HomePage.userIsOnHomePage();
});

When(/^I navigate to the homepage$/, async function() {
  await HomePage.navigateToHomepage();
});

Then(/^I should see a '(.*)' notification saying ['"](.*)['"]$/, async function(
  notificationType: string,
  notificationMessage: string
) {
  const notification = await this.browser.wait(
    until.elementLocated(HomePage.notification),
    5000,
    'Could not find notification'
  );
  await notification.isDisplayed();

  const message = await this.browser
    .wait(until.elementLocated(HomePage.notificationMessage), 5000, 'Could not find notification message')
    .getText();

  const isErrorNotification = await hasClassName(notification, notificationType);

  equal(isErrorNotification, true, `The shown notification is not a type of "${notificationType}"`);
  equal(message, notificationMessage, `Notification message "${message}" is not equal to "${notificationMessage}"`);
});
