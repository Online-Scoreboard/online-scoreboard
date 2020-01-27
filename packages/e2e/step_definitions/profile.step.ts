import assert from 'assert';
import { until, Key } from 'selenium-webdriver';
import { Then, When } from 'cucumber';
import ProfilePage from '../pages/profile.page';
import DashboardPage from '../pages/dashboard.page';

When(/^I change my username$/, async function() {
  const newUserName = ProfilePage.generateNewUsername();
  const usernameEl = this.browser.findElement(ProfilePage.getUsernameInput());
  const saveUsernameBtn = this.browser.findElement(ProfilePage.getSaveUsername());

  this.username = newUserName;

  const text = await usernameEl.getAttribute('value');

  new Array(text.length).fill('x').forEach(async () => {
    await usernameEl.sendKeys(Key.BACK_SPACE);
    await new Promise(r => setTimeout(r, 300));
  });

  usernameEl.sendKeys(newUserName);
  await new Promise(r => setTimeout(r, 300));

  await saveUsernameBtn.click();

  await this.browser.wait(until.elementLocated(ProfilePage.getSaveUsername())).isEnabled();
  await new Promise(r => setTimeout(r, 300));
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

Then(/^I should see my new username$/, async function() {
  const welcomeMessage = await this.browser.findElement(DashboardPage.getWelcomeMessage()).getText();

  assert.equal(
    welcomeMessage.indexOf(this.username),
    8,
    `${welcomeMessage}, does not contain username: ${this.username}`
  );
});
