// 1. Сортировка товаров по возрастанию цены
import { test, expect } from '@playwright/test';
import ProductPage from '../pages/ProductPage';


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

test.describe('Сортировка товаров по возрастанию/убыванию цены', () => {
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    productPage = new ProductPage(page);
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').click();
    await page.locator('[data-test="username"]').fill(USER_LOGIN[0]);
    await page.locator('[data-test="username"]').press('Tab');
    await page.locator('[data-test="password"]').fill(USER_PASS[0]);
    await page.locator('[data-test="login-button"]').click();; 
  });

  test('Товары должны быть отсортированны по возрастанию/убыванию', async () => {
    
    await productPage.sortBy('lohi');
    const isSortedLohi = await productPage.isPricesSortedLowToHigh();
    
    expect(isSortedLohi).toBe(true);

    await productPage.sortBy('hilo');
    const isSortedHilo = await productPage.isPricesSortedHighToLow();
    expect(isSortedHilo).toBe(true);


  });
});

