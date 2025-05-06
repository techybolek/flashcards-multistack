import { Page, Locator, expect } from '@playwright/test';

export class TestPage {
  readonly page: Page;
  readonly messageTextarea: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.messageTextarea = page.getByPlaceholder('Type your message here...');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async goto() {
    await this.page.goto('/test-page');
  }

  async fillMessageForm(message: string) {
    await this.messageTextarea.fill(message);
  }

  async submitMessage() {
    await this.submitButton.click();
  }

  async expectMessageSubmitted() {
    // This assumes there's a dialog or alert with the message
    // You may need to adjust this based on your actual implementation
    const dialog = this.page.getByText('Message submitted:');
    await expect(dialog).toBeVisible();
  }

  async expectEmptyMessageWarning() {
    const warning = this.page.getByText('Please enter a message first!');
    await expect(warning).toBeVisible();
  }
} 