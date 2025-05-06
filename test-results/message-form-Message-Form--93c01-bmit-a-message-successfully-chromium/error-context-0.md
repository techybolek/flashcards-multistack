# Test info

- Name: Message Form >> should submit a message successfully
- Location: /home/tromanow/10x10/L4/e2e/message-form.spec.ts:5:3

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "Message submitted: Hello from Playwright!"
Received string:    "Please enter a message first!"
    at Page.<anonymous> (/home/tromanow/10x10/L4/e2e/message-form.spec.ts:14:32)
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import { TestPage } from './pages/TestPage';
   3 |
   4 | test.describe('Message Form', () => {
   5 |   test('should submit a message successfully', async ({ page }) => {
   6 |     const testPage = new TestPage(page);
   7 |     await testPage.goto();
   8 |     
   9 |     // Fill and submit the form
  10 |     await testPage.fillMessageForm('Hello from Playwright!');
  11 |     
  12 |     // Handle the alert dialog
  13 |     page.on('dialog', async dialog => {
> 14 |       expect(dialog.message()).toContain('Message submitted: Hello from Playwright!');
     |                                ^ Error: expect(received).toContain(expected) // indexOf
  15 |       await dialog.accept();
  16 |     });
  17 |     
  18 |     await testPage.submitMessage();
  19 |   });
  20 |   
  21 |   test('should show warning for empty message', async ({ page }) => {
  22 |     const testPage = new TestPage(page);
  23 |     await testPage.goto();
  24 |     
  25 |     // Handle the alert dialog
  26 |     page.on('dialog', async dialog => {
  27 |       expect(dialog.message()).toBe('Please enter a message first!');
  28 |       await dialog.accept();
  29 |     });
  30 |     
  31 |     // Submit without filling the form
  32 |     await testPage.submitMessage();
  33 |   });
  34 |   
  35 |   test('should take screenshot for visual comparison', async ({ page }) => {
  36 |     const testPage = new TestPage(page);
  37 |     await testPage.goto();
  38 |     
  39 |     // Take a screenshot for visual regression testing
  40 |     await expect(page).toHaveScreenshot('message-form.png');
  41 |   });
  42 | }); 
```