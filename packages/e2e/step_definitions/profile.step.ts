import assert from 'assert';
import { until } from 'selenium-webdriver';
import { Given, setDefaultTimeout, Then, When } from 'cucumber';
import { CUCUMBER_STEP_TIMEOUT, HOMEPAGE_TITLE } from '../support/const';
import { hasClassName } from '../utils';
import ProfilePage from '../pages/profile.page';

When(/^I navigate to the Profile page$/, async function() {
  await ProfilePage.navigateToProfile();
});

Then(/^I should see the Profile page$/, async function() {
  const urlProfile = '/profile';
  await this.browser.wait(until.urlContains(urlProfile), 5000, `Expected url path to be /profile`);

  const expected = 'Profile';
  const title = await this.browser.findElement(ProfilePage.getPageTitle()).getText();

  assert.deepStrictEqual(title, expected, `Expected profile page title to be: ${expected}, got: ${title}`);
});

Then(/^The page should contain a '(.*)' form$/, async function(form: string) {
  const expected = form.charAt(0).toUpperCase() + form.slice(1, form.length); // Capitalize the title

  const formTitle = await this.browser.findElement(ProfilePage.getForm(form)).getText();

  assert.deepStrictEqual(formTitle, expected, `Expected form title to be: ${expected}, got: ${formTitle}`);
});
