import { By } from 'selenium-webdriver';
import { uniqueNamesGenerator, names } from 'unique-names-generator';

export default class ProfilePage {
  static readonly pageTitle = By.css(`h2`);
  static readonly cardUsername = By.css(`#card-username .card-username__title span`);
  static readonly cardAvatar = By.css(`#card-avatar .card-avatar__title span`);
  static readonly usernameInput = By.css('#card-username input');
  static readonly saveUsernameBtn = By.css('#card-username button');

  static generateNewUsername(): string {
    return uniqueNamesGenerator({
      dictionaries: [names],
      length: 1,
      style: 'capital',
    });
  }
}
