import { Given, setDefaultTimeout, Then, When } from 'cucumber';
import { CUCUMBER_STEP_TIMEOUT, HOMEPAGE_TITLE } from '../support/const';
import assert from 'assert';
import HomePage from '../pages/home.page';

setDefaultTimeout(CUCUMBER_STEP_TIMEOUT);

Given(/^I am on the Online Scoreboard homepage$/, async function() {
  await HomePage.navigateToHomepage();
});

Then(/^I should be on the Online Scoreboard homepage$/, async function() {
  await new Promise(r => setTimeout(r, 300)); // wait for page navigation
  const actualTitle = await this.browser.getTitle();
  assert.deepStrictEqual(
    actualTitle,
    HOMEPAGE_TITLE,
    `Titles did not match. Expected: ${HOMEPAGE_TITLE}, got: ${actualTitle}`
  );

  const h1 = await this.browser.findElement(HomePage.getMainHeading()).getText();
  assert.deepStrictEqual(h1, HOMEPAGE_TITLE, `Expected homepage heading to be: ${HOMEPAGE_TITLE}, got: ${h1}`);
});

When(/^I navigate to the Online Scoreboard homepage$/, async function() {
  await HomePage.navigateToHomepage();
});
