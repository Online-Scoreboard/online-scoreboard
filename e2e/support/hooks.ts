import { After, Before, BeforeAll, Status } from 'cucumber';
import { Builder } from 'selenium-webdriver';
import { ServiceBuilder, setDefaultService } from 'selenium-webdriver/chrome';
import { IMPLICIT_TIMEOUT, PAGE_LOAD_TIMEOUT, SCRIPT_TIMEOUT } from './consts';
import { envConfig } from '../env-keys';
import { getBrowserCapabilities } from './browser-capabilities';
import { TestRunContext } from './test-run-context';
import geckoDriver from 'chromedriver';

BeforeAll(async function() {
  const capabilities = getBrowserCapabilities(envConfig.BROWSER);
  TestRunContext.setCapabilities(capabilities);
});

Before(async function() {
  try {
    const service = new ServiceBuilder(geckoDriver.path).build();
    setDefaultService(service);

    this.browser = await new Builder().withCapabilities(TestRunContext.capabilities).build();

    await this.browser
      .manage()
      .setTimeouts({ implicit: IMPLICIT_TIMEOUT, pageLoad: PAGE_LOAD_TIMEOUT, script: SCRIPT_TIMEOUT });
  } catch (e) {
    console.log('Failed to start the browser');
    console.log(e);
    process.exit(1);
  }
});

After(async function(scenario) {
  if (scenario.result.status === Status.FAILED) {
    try {
      const screenShot = await this.browser.takeScreenshot();
      this.attach(screenShot, 'image/png');
    } catch (e) {
      console.log(e);
    }
  }

  try {
    await this.browser.quit();
  } catch (e) {
    console.log('Failed to quit the browser');
    console.log(e);
    process.exit(1);
  }
});
