import { Page, Locator } from '@playwright/test';

class CompletePage {
  private page: Page;
  private completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.completeHeader = page.locator('.complete-header');
  }

  async getCompleteHeaderText(): Promise<string | null> {
    return this.completeHeader.textContent();
  }
}
export default CompletePage;

