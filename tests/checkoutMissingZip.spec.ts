import { test, expect, Page, Locator } from '@playwright/test';
import ProductPage from '../pages/ProductPage';
import CheckoutPage from '../pages/CheckoutPage';
import LoginPage from '../pages/LoginPage';

const USER_LOGIN = [
  'standard_user',
  'locked_out_user',
  'problem_user',
  'performance_glitch_user',
  'error_user',
  'visual_user'
] as const;

const USER_PASS = [
  'secret_sauce'
] as const;

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

test.describe('Попытка оформления заказа без заполненного поля zip code', () => {
  let loginPage: LoginPage;
  let productPage: ProductPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

   
    await loginPage.navigateTo();
    await page.locator('[data-test="username"]').fill(USER_LOGIN[5]);
    await page.locator('[data-test="password"]').fill(USER_PASS[0]);
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');


    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click(); 
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await page.locator('[data-test="checkout"]').click(); 
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
  });

  test('Отображаеится сообщение об ошибке \"Postal Code is required\" ', async () => {
    await checkoutPage.fillShippingInformation('Петя', 'Васечкин', ''); // Передаем пустое поле zip code
    await checkoutPage.continueCheckout();
    await checkoutPage.screenShotError();
    const errorMessage = await checkoutPage.getErrorMessage();
    expect(errorMessage).toContain('Error: Postal Code is required'); // Сообщение об ошибке
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html'); // Should remain on the same page
  });
});