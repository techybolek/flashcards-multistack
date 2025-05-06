import { test, expect } from '@playwright/test';
import { TestPage } from './pages/TestPage';

test.describe('Message Form', () => {
  test('should submit a message successfully', async ({ page }) => {
    const testPage = new TestPage(page);
    await testPage.goto();
    
    // Fill and submit the form
    await testPage.fillMessageForm('Hello from Playwright!');
    
    // Handle the alert dialog
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Message submitted: Hello from Playwright!');
      await dialog.accept();
    });
    
    await testPage.submitMessage();
  });
  
  test('should show warning for empty message', async ({ page }) => {
    const testPage = new TestPage(page);
    await testPage.goto();
    
    // Handle the alert dialog
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('Please enter a message first!');
      await dialog.accept();
    });
    
    // Submit without filling the form
    await testPage.submitMessage();
  });
  
  test('should take screenshot for visual comparison', async ({ page }) => {
    const testPage = new TestPage(page);
    await testPage.goto();
    
    // Take a screenshot for visual regression testing
    await expect(page).toHaveScreenshot('message-form.png');
  });
}); 