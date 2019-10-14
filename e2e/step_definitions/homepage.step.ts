import { setDefaultTimeout, Then, When } from 'cucumber';
import { CUCUMBER_STEP_TIMEOUT, HOMEPAGE_TITLE } from '../support/consts';
import assert from 'assert';
import { envConfig } from '../env-keys';

setDefaultTimeout(CUCUMBER_STEP_TIMEOUT);

When(/^I navigate to the homepage$/, async function() {
  await this.browser.get(envConfig.HOMEPAGE_URL);
});
Then(/^I should be on the homepage$/, async function() {
  const actualTitle = await this.browser.getTitle();
  assert.deepStrictEqual(
    actualTitle,
    HOMEPAGE_TITLE,
    `Titles did not match. Expected: ${HOMEPAGE_TITLE}, got: ${actualTitle}`
  );
});
