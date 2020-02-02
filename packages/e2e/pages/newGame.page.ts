import { By } from 'selenium-webdriver';

export default class NewGamePage {
  public static getMainHeading(): By {
    return By.css(`h1`);
  }
  public static getGameNameTitle(): By {
    return By.css(`.newGameTitle span`);
  }
  public static getNextButton(): By {
    return By.css(`button.nextStep`);
  }
  public static getPrevButton(): By {
    return By.css(`button.prevStep`);
  }
  public static getGameNameInput(): By {
    return By.css(`#gameName input`);
  }
  public static getGameNameValidation(): By {
    return By.css(`p.cardValidation`);
  }
  public static getPredefinedGameRules(): By {
    return By.css(`#gameRulesAutocomplete`);
  }
  public static getPredefinedGameRulesList(): By {
    return By.css(`.MuiAutocomplete-popper`);
  }
  public static getAdvancedGameRules(): By {
    return By.css(`#advanced-game-rules`);
  }
  public static getMatchesBasedGame(): By {
    return By.css(`.isMatchesBased`);
  }
  public static getWinningMatchesCondition(): By {
    return By.css(`.winningScoreEnabled`);
  }
  public static getWinningScoreInput(): By {
    return By.css(`input[name="winningScore"]`);
  }
}
