import { By } from 'selenium-webdriver';

export default class NavBarPage {
  static readonly logInBtn = By.xpath(`//a/span[contains(text(), 'Log in')]`);
}
