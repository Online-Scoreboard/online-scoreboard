import { By } from 'selenium-webdriver';

export default class HomePage {
  public static getMainHeading(): By {
    return By.css(`div > h1`);
  }

  public static getWelcomeMessage(): By {
    return By.css('h2.welcome');
  }
}
