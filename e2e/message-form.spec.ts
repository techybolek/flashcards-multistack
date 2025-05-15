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
    
    // Wait for any animations to complete
    await page.waitForTimeout(1000);
    
    // Ensure consistent viewport size
    await page.setViewportSize({ width: 1280, height: 720 });
    
    await expect(page).toHaveScreenshot('message-form.png', {
      threshold: 0.2, // Allow for small differences
      animations: 'disabled', // Disable animations
      scale: 'css' // Use CSS scale instead of device scale
    });
  });
}); 