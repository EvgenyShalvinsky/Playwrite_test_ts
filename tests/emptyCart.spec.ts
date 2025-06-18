import { test, expect, Page, Locator } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import ProductPage from '../pages/ProductPage';
import CheckoutPage from '../pages/CheckoutPage';
import OverviewPage from '../pages/OverviewPage';
import CompletePage from '../pages/CompletePage';


class CartPage {
  private page: Page;
  private checkoutButton: Locator;
  private errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }
  
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async screenShotError(): Promise<void> {
    await this.page.screenshot({ path: '../screenshots/overviewPage.png' });
  }
}

test.describe('Оформление с пустой корзиной', () => {
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

  test('Отображается сообщение об ошибке \"Busket is empty, add item\"', async ({ page }) => {
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await cartPage.proceedToCheckout();
    await cartPage.screenShotError();
    const errorMessage = await checkoutPage.getErrorMessage();
    expect(errorMessage).toContain('Error: Busket is empty, add item'); // Сообщение об ошибке
    await expect(cartPage.errorMessage).toBeVisible();
    await expect(cartPage.page).toHaveURL('https://www.saucedemo.com/cart.html');
  });
});