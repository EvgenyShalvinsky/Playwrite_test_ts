import { Page, Locator } from '@playwright/test';

class CartPage {
  private page: Page;
  private checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }
  
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
  
}