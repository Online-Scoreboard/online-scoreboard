import { By } from 'selenium-webdriver';
import { uniqueNamesGenerator, names } from 'unique-names-generator';

export default class HomePage {
  public static getPageTitle(): By {
    return By.css(`h1`);
  }
  public static getCardUsername(): By {
    return By.css(`#card-username .card-username__title span`);
  }
  public static getCardAvatar(): By {
    return By.css(`#card-avatar .card-avatar__title span`);
  }
  public static getUsernameInput(): By {
    return By.css('#card-username input');
  }
  public static getSaveUsername(): By {
    return By.css('#card-username button');
  }
  public static generateNewUsername(): string {
    return uniqueNamesGenerator({
      dictionaries: [names],
      length: 1,
      style: 'capital',
    });
  }
}
