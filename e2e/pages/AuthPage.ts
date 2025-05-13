import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: /Sign in|Signing in/ });
    this.errorMessage = page.getByText('Invalid login credentials');
  }

  async goto() {
    await this.page.goto('/auth/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    
    // Wait for the button to be enabled
    await expect(this.loginButton).toBeEnabled();
    
    // Click the button and wait for loading state
    await this.loginButton.click();
    
    // Wait for navigation to dashboard
    await this.page.waitForURL('dashboard', { timeout: 40000 });
  }

  async expectLoginError() {
    await expect(this.errorMessage).toBeVisible();
  }

  async expectToBeLoggedIn() {
    await expect(this.page).toHaveURL('dashboard');
  }
} 