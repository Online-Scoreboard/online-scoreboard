import { By } from 'selenium-webdriver';

export default class NewGamePage {
  public static getMainHeading(): By {
    return By.css(`h1`);
  }
  public static getGameNameForm(): By {
    return By.css(`#gameName span`);
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
}
