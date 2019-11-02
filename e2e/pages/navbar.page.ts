import { By } from 'selenium-webdriver';

export default class NavBarPage {
  static loginButton(): By {
    return By.xpath(`//a/span[contains(text(), 'Log in')]`);
  }
}
