import { ok } from 'assert';
import { until } from 'selenium-webdriver';
import { Then } from 'cucumber';
import HomePage from '../pages/HomePage';

Then(/^I should see the user dashboard$/, async function() {
  await this.browser
    .wait(until.elementLocated(HomePage.welcomeMessage), 5000, `User dashboard is not visible`)
    .isDisplayed();

  const welcome = await this.browser.findElement(HomePage.welcomeMessage).getText();
  ok(welcome.match(/Welcome \w+!/g), 'Cannot find a welcome message on the page');
});
