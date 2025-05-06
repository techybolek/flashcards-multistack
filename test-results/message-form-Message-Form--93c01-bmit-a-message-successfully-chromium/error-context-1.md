# Test info

- Name: Message Form >> should submit a message successfully
- Location: /home/tromanow/10x10/L4/e2e/message-form.spec.ts:5:3

# Error details

```
Error: locator.click: Test ended.
Call log:
  - waiting for getByRole('button', { name: 'Submit' })
    - locator resolved to <button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow h-9 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">Submit</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - performing click action

    at TestPage.submitMessage (/home/tromanow/10x10/L4/e2e/pages/TestPage.ts:23:29)
    at /home/tromanow/10x10/L4/e2e/message-form.spec.ts:18:20
```

# Test source

```ts
   1 | import { Page, Locator, expect } from '@playwright/test';
   2 |
   3 | export class TestPage {
   4 |   readonly page: Page;
   5 |   readonly messageTextarea: Locator;
   6 |   readonly submitButton: Locator;
   7 |
   8 |   constructor(page: Page) {
   9 |     this.page = page;
  10 |     this.messageTextarea = page.getByPlaceholder('Type your message here...');
  11 |     this.submitButton = page.getByRole('button', { name: 'Submit' });
  12 |   }
  13 |
  14 |   async goto() {
  15 |     await this.page.goto('/test-page');
  16 |   }
  17 |
  18 |   async fillMessageForm(message: string) {
  19 |     await this.messageTextarea.fill(message);
  20 |   }
  21 |
  22 |   async submitMessage() {
> 23 |     await this.submitButton.click();
     |                             ^ Error: locator.click: Test ended.
  24 |   }
  25 |
  26 |   async expectMessageSubmitted() {
  27 |     // This assumes there's a dialog or alert with the message
  28 |     // You may need to adjust this based on your actual implementation
  29 |     const dialog = this.page.getByText('Message submitted:');
  30 |     await expect(dialog).toBeVisible();
  31 |   }
  32 |
  33 |   async expectEmptyMessageWarning() {
  34 |     const warning = this.page.getByText('Please enter a message first!');
  35 |     await expect(warning).toBeVisible();
  36 |   }
  37 | } 
```