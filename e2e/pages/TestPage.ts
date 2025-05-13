import { Page, Locator, expect } from '@playwright/test';

export class TestPage {
  readonly page: Page;
  readonly messageTextarea: Locator;
  readonly submitButton: Locator;
  readonly messageForm: Locator;
  readonly statusMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.messageForm = page.getByTestId('message-form');
    this.messageTextarea = page.getByTestId('message-input');
    this.submitButton = page.getByTestId('submit-button');
    this.statusMessage = page.getByTestId('status-message');
  }

  async goto() {
    await this.page.goto('/test-page');
    await this.messageForm.waitFor({ state: 'visible' });
  }

  async fillMessageForm(message: string) {
    await this.messageTextarea.waitFor({ state: 'visible' });
    await this.messageTextarea.click();
    await this.messageTextarea.fill(message);
    // Ensure the value is set
    await expect(this.messageTextarea).toHaveValue(message);
  }

  async submitMessage() {
    await this.submitButton.waitFor({ state: 'visible' });
    await this.submitButton.click();
  }

  async expectMessageSubmitted(expectedMessage: string) {
    await expect(this.statusMessage).toBeVisible();
    await expect(this.statusMessage).toHaveText(`Message submitted: ${expectedMessage}`);
  }

  async expectEmptyMessageWarning() {
    await expect(this.statusMessage).toBeVisible();
    await expect(this.statusMessage).toHaveText('Please enter a message first!');
  }
} 