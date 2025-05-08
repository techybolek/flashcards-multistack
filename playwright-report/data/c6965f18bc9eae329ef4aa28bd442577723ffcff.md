# Test info

- Name: Flashcard Generation Page >> should handle invalid text input
- Location: /home/tromanow/10x10/L4/e2e/flashcard-generation.spec.ts:77:3

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: getByText('Text must be between 1000 and 10000 characters')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByText('Text must be between 1000 and 10000 characters')

    at FlashcardGenerationPage.expectInvalidInputError (/home/tromanow/10x10/L4/e2e/pages/FlashcardGenerationPage.ts:47:37)
    at /home/tromanow/10x10/L4/e2e/flashcard-generation.spec.ts:90:25
```

# Page snapshot

```yaml
- button "bobo@bobo.com":
  - img
  - text: bobo@bobo.com
  - img
- main:
  - link "Back to Dashboard":
    - /url: /dashboard
    - img
    - text: Back to Dashboard
  - heading "Generate Flashcards" [level=1]
  - text: Enter text to generate flashcards
  - textbox "Enter text to generate flashcards": Too short
  - paragraph: Text must be at least 1000 characters long
  - text: 9 / 10000 characters(minimum 1000 characters required)
  - button "Generate Flashcards" [disabled]
```

# Test source

```ts
   1 | import { Page, Locator, expect } from '@playwright/test';
   2 |
   3 | export class FlashcardGenerationPage {
   4 |   readonly page: Page;
   5 |   readonly textInput: Locator;
   6 |   readonly generateButton: Locator;
   7 |   readonly backButton: Locator;
   8 |   readonly heading: Locator;
   9 |   readonly loadingIndicator: Locator;
  10 |   readonly errorMessage: Locator;
  11 |   readonly proposalsList: Locator;
  12 |
  13 |   constructor(page: Page) {
  14 |     this.page = page;
  15 |     this.textInput = page.getByRole('textbox');
  16 |     this.generateButton = page.getByRole('button', { name: 'Generate Flashcards' });
  17 |     this.backButton = page.getByRole('link', { name: 'Back to Dashboard' });
  18 |     this.heading = page.getByRole('heading', { name: 'Generate Flashcards' });
  19 |     this.loadingIndicator = page.getByText('Generating flashcards...');
  20 |     this.errorMessage = page.getByText('Text must be between 1000 and 10000 characters');
  21 |     this.proposalsList = page.locator('.grid > div');
  22 |   }
  23 |
  24 |   async goto() {
  25 |     await this.page.goto('/generate');
  26 |   }
  27 |
  28 |   async fillTextInput(text: string) {
  29 |     await this.textInput.fill(text);
  30 |   }
  31 |
  32 |   async generate() {
  33 |     await this.generateButton.click();
  34 |     // Wait for loading state to appear
  35 |     //await expect(this.loadingIndicator).toBeVisible();
  36 |   }
  37 |
  38 |   async waitForProposals() {
  39 |     // First wait for loading to complete
  40 |     await expect(this.loadingIndicator).toBeHidden({ timeout: 30000 });
  41 |     
  42 |     // Then wait for proposals to appear
  43 |     await expect(this.proposalsList.first()).toBeVisible({ timeout: 30000 });
  44 |   }
  45 |
  46 |   async expectInvalidInputError() {
> 47 |     await expect(this.errorMessage).toBeVisible();
     |                                     ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  48 |     await expect(this.generateButton).toBeDisabled();
  49 |   }
  50 |
  51 |   async getFirstProposal() {
  52 |     return this.proposalsList.first();
  53 |   }
  54 |
  55 |   async acceptProposal(proposal: Locator) {
  56 |     await proposal.getByRole('button', { name: 'Accept' }).click();
  57 |     await expect(proposal.getByText('Accepted')).toBeVisible();
  58 |   }
  59 |
  60 |   async editProposal(proposal: Locator, front: string, back: string) {
  61 |     await proposal.getByRole('button', { name: 'Edit' }).click();
  62 |     await proposal.getByRole('textbox', { name: 'Front' }).fill(front);
  63 |     await proposal.getByRole('textbox', { name: 'Back' }).fill(back);
  64 |     await proposal.getByRole('button', { name: 'Save' }).click();
  65 |   }
  66 |
  67 |   async saveAccepted() {
  68 |     await this.page.getByRole('button', { name: 'Save Accepted' }).click();
  69 |     await expect(this.page.getByText('Successfully saved accepted flashcards!')).toBeVisible();
  70 |     await this.page.waitForURL('**/dashboard', { timeout: 5000 });
  71 |   }
  72 | } 
```