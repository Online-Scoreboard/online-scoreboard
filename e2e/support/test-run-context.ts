import { BrowserCapabilities } from './browser-capabilities';

export class TestRunContext {
  static capabilities: BrowserCapabilities;
  static setCapabilities(capabilities: BrowserCapabilities): void {
    this.capabilities = capabilities;
  }
}
