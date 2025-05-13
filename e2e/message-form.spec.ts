import { test, expect } from '@playwright/test';
import { TestPage } from './pages/TestPage';

test.describe('Message Form', () => {
  test('should submit a message successfully', async ({ page }) => {
    const testPage = new TestPage(page);
    await testPage.goto();
    
    const message = 'Hello from Playwright!';
    await testPage.fillMessageForm(message);
    await testPage.submitMessage();
    await testPage.expectMessageSubmitted(message);
  });
  
  test('should show warning for empty message', async ({ page }) => {
    const testPage = new TestPage(page);
    await testPage.goto();
    await testPage.submitMessage();
    await testPage.expectEmptyMessageWarning();
  });
  
  test('should take screenshot for visual comparison', async ({ page }) => {
    const testPage = new TestPage(page);
    await testPage.goto();
    await expect(page).toHaveScreenshot('message-form.png');
  });
}); 