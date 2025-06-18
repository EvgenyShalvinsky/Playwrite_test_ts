
import { Page, Locator } from '@playwright/test';

class ProductPage {
  private page: Page;
  private productSortContainer: Locator;
  private inventoryContainer: Locator;
  private inventoryItemPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productSortContainer = page.locator('[data-test="product-sort-container"]');
    this.inventoryContainer = page.locator('[data-test="inventory-item"]');
    this.inventoryItemPrices = page.locator('[data-test="inventory-item-price"]');
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async sortBy(optionValue: string): Promise<void> {
    await this.productSortContainer.selectOption(optionValue);
  }

  async getPrices(): Promise<number[]> {
    const pricesText = await this.inventoryItemPrices.allTextContents();
    return pricesText.map(price => parseFloat(price.replace('$', '')));
  }

  async isPricesSortedLowToHigh(): Promise<boolean> {
    const prices = await this.getPrices();
    for (let i = 0; i < prices.length - 1; i++) {
      if (prices[i] > prices[i + 1]) {
        return false;
      }
    }
    return true;
  }
  
  async isPricesSortedHighToLow(): Promise<boolean> {
    const prices = await this.getPrices();
    for (let i = 0; i < prices.length - 1; i++) {
      if (prices[i] < prices[i + 1]) {
        return false;
      }
    }
    return true;
  }
}
export default ProductPage;

