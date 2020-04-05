import { By, until } from 'selenium-webdriver';
import { TestRunContext } from '../support/test-run-context';
import { envConfig } from '../env-keys';
import { deepStrictEqual } from 'assert';

export default class NewGamePage {
  /** Global */
  static readonly mainHeading = By.css(`h2`);
  static readonly nextBtn = By.css(`button.nextStep`);
  static readonly prevBtn = By.css(`button.prevStep`);
  /** Game name */
  static readonly gameNameInput = By.css(`#gameName input`);
  static readonly gameNameValidation = By.css(`p.cardValidation`);
  static readonly gameNameTitle = By.css(`.newGameTitle span`);
  /** Game rules */
  static readonly predefinedGameRules = By.css(`#gameRulesAutocomplete`);
  static readonly predefinedGameRulesList = By.css(`.MuiAutocomplete-popper`);
  static readonly advancedGameRules = By.css(`#advanced-game-rules`);
  /** Advanced game rules */
  static readonly matchesBasedGame = By.css(`.isMatchesBased`);
  static readonly winningMatchesCondition = By.css(`.winningScoreEnabled`);
  static readonly winningScoreInput = By.css(`input[name="winningScore"]`);
  /** Teams */
  static readonly teamSize = By.css(`span[role="slider"]`);
  static readonly teamSizeSlider = By.css(`.teamSizeSlider`);
  static readonly teamSizeOnSlider = By.css(`span.teamSizeSlider span.MuiSlider-mark`);
  static readonly currentTeamSizeOnSlider = By.css(`span.teamSizeSlider span.MuiSlider-thumb span`);

  static getTeamColor(color: string): By {
    return By.css(`span.teamColor__${color} input`);
  }

  static async navigateToNewGame(): Promise<void> {
    const targetUrl = '/new-game';
    await TestRunContext.browser.get(envConfig.HOMEPAGE_URL + targetUrl);
    await TestRunContext.browser.wait(until.urlContains(targetUrl), 5000, `Expected url path to be ${targetUrl}`);
  }

  static async newGameViewVisible(): Promise<void> {
    const expected = 'Create A New Game';

    const h1 = await TestRunContext.browser.wait(
      until.elementLocated(NewGamePage.mainHeading),
      5000,
      'Could not locate New Game h1 heading'
    );

    deepStrictEqual(await h1.getText(), expected, `Expected login page heading to be: Log In, got: ${h1}`);

    const stepTitle = await TestRunContext.browser.findElement(NewGamePage.gameNameTitle).getText();
    deepStrictEqual(stepTitle, 'Game Name', `Expected form title to be: Game Name, got: ${stepTitle}`);
  }
}
