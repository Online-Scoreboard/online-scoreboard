import { By } from 'selenium-webdriver';
import { uniqueNamesGenerator, names } from 'unique-names-generator';

export default class HomePage {
  public static getPageTitle(): By {
    return By.css(`h1`);
  }
  public static getForm(form: string): By {
    if (form === 'username') {
      return By.css(`#card-username span.MuiCardHeader-title`);
    }

    return By.css(`#card-avatar span.MuiCardHeader-title`);
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
