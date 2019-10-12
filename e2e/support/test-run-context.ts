import { BrowserCapabilities } from '../typings';

export class TestRunContext {
  static capabilities: BrowserCapabilities;
  static setCapabilities(capabilities: BrowserCapabilities): void {
    this.capabilities = capabilities;
  }
}
