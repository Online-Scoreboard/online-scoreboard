import assert from 'assert';
import { until } from 'selenium-webdriver';
import { When, Then } from 'cucumber';
import NewGamePage from '../pages/newGame.page';

Then(/^I should see the New Game page$/, async function() {
  await new Promise(r => setTimeout(r, 300)); // wait for page navigation
  const targetUrl = '/new-game';
  await this.browser.wait(until.urlContains(targetUrl), 5000, `Expected url path to be ${targetUrl}`);

  const expected = 'Create A New Game';
  const h1 = await this.browser.findElement(NewGamePage.getMainHeading()).getText();
  assert.deepStrictEqual(h1, expected, `Expected login page heading to be: Log In, got: ${h1}`);
});

Then(/^The new game page should contain a '(.*)' form$/, async function(formName: string) {
  let formTitle = '';
  if (formName === 'Game Name') {
    formTitle = await this.browser.findElement(NewGamePage.getGameNameForm()).getText();
  }

  assert.deepStrictEqual(formTitle, formName, `Expected form title to be: ${formName}, got: ${formTitle}`);
});

Then(/^The '(.*)' button should be '(.*)'$/, async function(name: string, state: string) {
  const buttonEl =
    name === 'next'
      ? this.browser.findElement(NewGamePage.getNextButton())
      : this.browser.findElement(NewGamePage.getPrevButton());

  const buttonState = await (await buttonEl).getAttribute('disabled');
  const expectedButtonState = state === 'disabled' ? 'true' : null;

  assert.deepStrictEqual(
    buttonState,
    expectedButtonState,
    `Expected "${name}" button disabled state to be: ${expectedButtonState}, got: ${buttonState}`
  );
});

When(/^I enter '(.*)' as a game name$/, async function(input: string) {
  const inputEl = await this.browser.findElement(NewGamePage.getGameNameInput());

  await inputEl.sendKeys(input);
});

Then(/^I should see a '(.*)' message saying '(.*)'$/, async function(level: string, message: string) {
  const validationEl = await this.browser.findElement(NewGamePage.getGameNameValidation());
  const validationCopy = await validationEl.getText();
  const validationLevel = await (await validationEl.getAttribute('class')).indexOf(level);
  const isCorrectValidationLevel = validationLevel >= 0;

  assert.deepStrictEqual(isCorrectValidationLevel, true, `Expected validation message to be level: ${level}`);
  assert.deepStrictEqual(
    validationCopy,
    message,
    `Expected validation message to be: "${message}", got: ${validationCopy}`
  );
});
