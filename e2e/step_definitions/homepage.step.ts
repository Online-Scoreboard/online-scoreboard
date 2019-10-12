import { Then, When } from 'cucumber';
import { HOMEPAGE_TITLE } from '../support/consts';
import assert from 'assert';
import { envConfig } from '../env-keys';

When(/^I navigate to the homepage$/, function() {
  return this.browser.get(envConfig.HOMEPAGE_URL);
});

Then(/^I should be on the homepage$/, async function() {
  const actualTitle = await this.browser.getTitle();

  assert.deepStrictEqual(
    actualTitle,
    HOMEPAGE_TITLE,
    `Titles did not match. Expected: ${HOMEPAGE_TITLE}, got: ${actualTitle}`
  );
});
