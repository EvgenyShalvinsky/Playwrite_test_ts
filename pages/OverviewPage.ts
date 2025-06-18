import { Page, Locator } from '@playwright/test';

class OverviewPage {
  private page: Page;
  private finishButton: Locator;
  private totalAmount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.finishButton = page.locator('[data-test="finish"]');
    this.totalAmount = page.locator('.summary_total_label');
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  async getTotalAmount(): Promise<string | null> {
    return this.totalAmount.textContent();
  }
}
export default OverviewPage;