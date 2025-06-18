import { test, expect, Page, Locator } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import ProductPage from '../pages/ProductPage';
import CheckoutPage from '../pages/CheckoutPage';
import OverviewPage from '../pages/OverviewPage';
import CompletePage from '../pages/CompletePage';


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

test.describe('Полное оформление заказа с добавлением товара в корзину и оплатой', () => {
  let loginPage: LoginPage;
  let productPage: ProductPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let overviewPage: OverviewPage;
  let completePage: CompletePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    overviewPage = new OverviewPage(page);
    completePage = new CompletePage(page);

    await loginPage.navigateTo();
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('Успешно отобразилась страница с текстом \"Thank you for your order!\" ', async ({ page }) => {
    // Add an item to the cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // Navigate to cart
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

    // Proceed to checkout
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');

    // Fill shipping information
    await checkoutPage.fillShippingInformation('Test', 'User', '12345');
    await checkoutPage.continueCheckout();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');

    // Verify overview and finish order
    await expect(overviewPage.totalAmount).toBeVisible();
     // Check if total amount is displayed
    await overviewPage.finishOrder();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');

    // Verify order completion
    const completeHeaderText = await completePage.getCompleteHeaderText();
    expect(completeHeaderText).toBe('Thank you for your order!');
  });
});