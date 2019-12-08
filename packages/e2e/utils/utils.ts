import { WebElement } from 'selenium-webdriver';

export async function hasClassName(el: WebElement, className: string): Promise<boolean> {
  const classNames = await el.getAttribute('class');

  const classNamesArray = classNames.split(' ');
  return Boolean(~classNamesArray.indexOf(className));
}
