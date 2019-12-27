import assert from 'assert';
import { until } from 'selenium-webdriver';
import { Then } from 'cucumber';
import DashboardPage from '../pages/dashboard.page';

Then(/^I should see the user dashboard$/, async function() {
  await this.browser.wait(until.elementLocated(DashboardPage.getWelcomeMessage())).isDisplayed();

  const welcome = await this.browser.findElement(DashboardPage.getWelcomeMessage()).getText();
  assert.ok(welcome.match(/Welcome \w+!/g), 'Cannot find a welcome message on the page');
});
