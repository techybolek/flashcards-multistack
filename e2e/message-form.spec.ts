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
  
  test('should have correct visual properties and layout', async ({ page }) => {
    const testPage = new TestPage(page);
    await testPage.goto();
    
    // Test form layout and positioning
    await expect(testPage.messageForm).toBeVisible();
    const formBox = await testPage.messageForm.boundingBox();
    expect(formBox).toBeTruthy();
    expect(formBox!.width).toBeGreaterThan(200); // Form should have reasonable width
    
    // Test textarea visual properties
    await expect(testPage.messageTextarea).toBeVisible();
    await expect(testPage.messageTextarea).toHaveCSS('resize', 'vertical');
    await expect(testPage.messageTextarea).toHaveCSS('min-height', '100px');
    
    // Test button styling
    await expect(testPage.submitButton).toBeVisible();
    await expect(testPage.submitButton).toHaveCSS('background-color', /rgb\(.*\)/); // Should have a background color
    await expect(testPage.submitButton).toHaveCSS('cursor', 'pointer');
    
    // Test form accessibility
    await expect(testPage.messageTextarea).toHaveAttribute('aria-label', 'Message input');
    await expect(testPage.submitButton).toHaveAttribute('type', 'submit');
    
    // Test responsive layout
    await page.setViewportSize({ width: 1280, height: 720 });
    const desktopBox = await testPage.messageForm.boundingBox();
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileBox = await testPage.messageForm.boundingBox();
    expect(desktopBox).toBeTruthy();
    expect(mobileBox).toBeTruthy();
    expect(desktopBox!.width).toBeGreaterThan(mobileBox!.width); // Should be responsive
    
    // Test form interactions
    await testPage.messageTextarea.hover();
    await expect(testPage.messageTextarea).toHaveCSS('border-color', /rgb\(.*\)/); // Should have hover state
    
    // Test form alignment
    const formPosition = await testPage.messageForm.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        margin: style.margin
      };
    });
    expect(formPosition.display).toBe('flex');
  });
}); 