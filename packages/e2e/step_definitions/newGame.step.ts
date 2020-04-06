import assert from 'assert';
import { until, Key } from 'selenium-webdriver';
import { When, Then } from 'cucumber';
import NewGamePage from '../pages/NewGamePage';

Then(/^I should see the New Game page$/, async function() {
  await new Promise(r => setTimeout(r, 300)); // wait for page navigation
  const targetUrl = '/new-game';
  await this.browser.wait(until.urlContains(targetUrl), 5000, `Expected url path to be ${targetUrl}`);

  const expected = 'Create A New Game';
  const h1 = await this.browser.findElement(NewGamePage.mainHeading).getText();
  assert.deepStrictEqual(h1, expected, `Expected login page heading to be: Log In, got: ${h1}`);
});

Then(/^The new game page should contain a '(.*)' form$/, async function(stepName: string) {
  const stepTitle = await this.browser.findElement(NewGamePage.gameNameTitle).getText();

  assert.deepStrictEqual(stepTitle, stepName, `Expected form title to be: ${stepName}, got: ${stepTitle}`);
});

When(/^I complete the '(.*)' step$/, async function(step: string) {
  const nextButton = this.browser.findElement(NewGamePage.nextBtn);

  if (step === 'Game Name') {
    const inputEl = await this.browser.findElement(NewGamePage.gameNameInput);
    const input = 'test game';

    await inputEl.sendKeys(input);
  }

  await nextButton.click();
});

Then(/^The '(.*)' button should be '(.*)'$/, async function(name: string, state: string) {
  const buttonEl =
    name === 'next' ? this.browser.findElement(NewGamePage.nextBtn) : this.browser.findElement(NewGamePage.prevBtn);

  const buttonState = await (await buttonEl).getAttribute('disabled');
  const expectedButtonState = state === 'disabled' ? 'true' : null;

  assert.deepStrictEqual(
    buttonState,
    expectedButtonState,
    `Expected "${name}" button disabled state to be: ${expectedButtonState}, got: ${buttonState}`
  );
});

When(/^I enter '(.*)' as a game name$/, async function(input: string) {
  const inputEl = await this.browser.findElement(NewGamePage.gameNameInput);

  await inputEl.sendKeys(input);
});

Then(/^I should see a '(.*)' message saying '(.*)'$/, async function(level: string, message: string) {
  const validationEl = await this.browser.findElement(NewGamePage.gameNameValidation);
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

Then(/^I should see a Predefined game Rules field$/, async function() {
  const predefinedGameRules = await this.browser.findElement(NewGamePage.predefinedGameRules).isDisplayed();

  assert.deepStrictEqual(
    predefinedGameRules,
    true,
    `Expected a Predefined game rules element to be visible of the page`
  );
});

Then(/^I expand the Advanced Rules$/, async function() {
  const advancedGameRules = await this.browser.findElement(NewGamePage.advancedGameRules);

  await advancedGameRules.click();
  await new Promise(r => setTimeout(r, 500)); // wait for accordion to expand
});

Then(/^I should see a list of Advanced game Rules$/, async function() {
  await this.browser
    .wait(
      until.elementLocated(NewGamePage.matchesBasedGame),
      5000,
      'Could not find Matches Based Game input in Game page'
    )
    .isDisplayed();

  const matchesBasedGame = await this.browser.findElement(NewGamePage.matchesBasedGame).isDisplayed();
  const winningMatchesCondition = await this.browser.findElement(NewGamePage.winningMatchesCondition).isDisplayed();

  assert.ok(matchesBasedGame, `Expected a matches based checkbox to be visible on the page`);
  assert.ok(winningMatchesCondition, `Expected a winning matches condition checkbox to be visible on the page`);
});

When(/^I interact with the custom game Rules$/, async function() {
  const isMatchesBasedGame = await this.browser.findElement(NewGamePage.matchesBasedGame);

  await isMatchesBasedGame.click();
});

Then(/^I click on the Predefined game Rules$/, async function() {
  const predefinedGameRules = await this.browser.findElement(NewGamePage.predefinedGameRules);

  await predefinedGameRules.click();
});

When(/^I enter some invalid game Rules$/, async function() {
  const isMatchesBasedGame = await this.browser.findElement(NewGamePage.matchesBasedGame);
  const winningScoreEnabled = await this.browser.findElement(NewGamePage.winningMatchesCondition);

  await isMatchesBasedGame.click();
  await winningScoreEnabled.click();

  await new Promise(r => setTimeout(r, 500)); // wait for new element to appear
  const winningScoreInput = await this.browser.findElement(NewGamePage.winningScoreInput);

  await winningScoreInput.sendKeys(Key.BACK_SPACE);
});

Then(/^I should see a list of predefined game Rules$/, async function() {
  await this.browser
    .wait(
      until.elementLocated(NewGamePage.predefinedGameRulesList),
      5000,
      'Could not find Predefined Game Rules List in Game page'
    )
    .isDisplayed();

  const predefinedGameRules = await this.browser.findElement(NewGamePage.predefinedGameRulesList).isDisplayed();

  assert.deepStrictEqual(
    predefinedGameRules,
    true,
    `Expected a list of Predefined game rules to be visible of the page`
  );
});

Then(/^The selected predefined game Rule should be '(.*)'$/, async function(ruleName: string) {
  const predefinedGameRule = await this.browser.findElement(NewGamePage.predefinedGameRules).getAttribute('value');
  const expectedRuleName = ruleName || '';

  assert.deepStrictEqual(
    predefinedGameRule,
    expectedRuleName,
    `Expected selected predefined game rule to be: "${expectedRuleName}", got: "${predefinedGameRule}"`
  );
});

Then(/^The predefined team size should be '(\d)'$/, async function(expectedTeamSize: number) {
  const teamSize = await this.browser.findElement(NewGamePage.teamSize).getAttribute('aria-valuenow');

  assert.deepStrictEqual(expectedTeamSize, teamSize, `Expected team size to be: ${expectedTeamSize}, got: ${teamSize}`);
});

Then(/^I set the team size to '(\d)'$/, async function(teamSize: string) {
  const expected = await this.browser.findElements(NewGamePage.teamSizeOnSlider);

  await expected[Number(teamSize) - 1].click();
  await new Promise(r => setTimeout(r, 250));

  const teamSizeLabel = await this.browser.findElement(NewGamePage.currentTeamSizeOnSlider);
  const currentValue = await teamSizeLabel.getText();

  assert.deepStrictEqual(currentValue, teamSize, `Expected team size to be: ${teamSize}, got: ${currentValue}`);
});

Then(/^The team color '(.*)' should be selected$/, async function(teamColor: string) {
  const teamColorEl = await this.browser.findElement(NewGamePage.getTeamColor(teamColor));
  const expected = await teamColorEl.getAttribute('value');

  assert.deepStrictEqual(
    'true',
    expected,
    `Expected team color ${teamColor} to be selected. Value received: ${expected}`
  );
});
