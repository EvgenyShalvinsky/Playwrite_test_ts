// 2. Переход к оформлению заказа без авторизации
import { test, expect } from '@playwright/test';
import ProductPage from '../pages/ProductPage';
import LoginPage from '../pages/LoginPage'; 
test.describe('Переход к оформлению заказа без авторизации', () => {
  let productPage: ProductPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    productPage = new ProductPage(page);
    loginPage = new LoginPage(page);
  });

  test('перенаправляет на страницу входа при попытке доступа к оформлению заказа без входа в систему', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/checkout-step-one.html'); 
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.errorMessage).toBeVisible(); 
  });
});
