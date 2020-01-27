import { until } from 'selenium-webdriver';
import { Then } from 'cucumber';
import { TestRunContext } from '../support/test-run-context';
import { envConfig } from '../env-keys';

Then(/^I navigate to '(.*)'$/, async function(target) {
  await TestRunContext.browser.get(envConfig.HOMEPAGE_URL + target);

  return this.browser.wait(until.urlContains(target), 5000, `Expected url path to be ${target}`);
});
