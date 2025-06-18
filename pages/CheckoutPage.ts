import { Page, Locator } from '@playwright/test';

class CheckoutPage {
  private page: Page;
  private firstNameField: Locator;
  private lastNameField: Locator;
  private postalCodeField: Locator;
  private continueButton: Locator;
  private errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameField = page.locator('[data-test="firstName"]');
    this.lastNameField = page.locator('[data-test="lastName"]');
    this.postalCodeField = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async fillShippingInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.postalCodeField.fill(postalCode);
  }

  async continueCheckout(): Promise<void> {
    await this.continueButton.click();
  }

  async getErrorMessage(): Promise<string | null> {
    return this.errorMessage.textContent();
  }

  async screenShotError(): Promise<void> {
    await this.page.screenshot({ path: '../screenshots/CheckoutPage.png' });
  }


}
export default CheckoutPage;