import { Page, Locator, expect } from '@playwright/test';

export class FlashcardGenerationPage {
  readonly page: Page;
  readonly textInput: Locator;
  readonly generateButton: Locator;
  readonly backButton: Locator;
  readonly heading: Locator;
  readonly loadingIndicator: Locator;
  readonly errorMessage: Locator;
  readonly proposalsList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.textInput = page.getByRole('textbox');
    this.generateButton = page.getByRole('button', { name: 'Generate Flashcards' });
    this.backButton = page.getByRole('link', { name: 'Back to Dashboard' });
    this.heading = page.getByRole('heading', { name: 'Generate Flashcards' });
    this.loadingIndicator = page.getByText('Generating flashcards...');
    this.errorMessage = page.getByText('Text must be at least 1000 characters long');
    this.proposalsList = page.locator('.grid > div');
  }

  async goto() {
    await this.page.goto('/generate');
  }

  async fillTextInput(text: string) {
    await this.textInput.fill(text);
  }

  async generate() {
    await this.generateButton.click();
    // Wait for loading state to appear
    //await expect(this.loadingIndicator).toBeVisible();
  }

  async waitForProposals() {
    // First wait for loading to complete
    await expect(this.loadingIndicator).toBeHidden({ timeout: 30000 });
    
    // Then wait for proposals to appear
    await expect(this.proposalsList.first()).toBeVisible({ timeout: 60000 });
  }

  async expectInvalidInputError() {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.generateButton).toBeDisabled();
  }

  async getFirstProposal() {
    return this.proposalsList.first();
  }

  async acceptProposal(proposal: Locator) {
    await proposal.getByRole('button', { name: 'Accept' }).click();
    await expect(proposal.getByText('Accepted')).toBeVisible();
  }

  async editProposal(proposal: Locator, front: string, back: string) {
    await proposal.getByRole('button', { name: 'Edit' }).click();
    await proposal.getByRole('textbox', { name: 'Front' }).fill(front);
    await proposal.getByRole('textbox', { name: 'Back' }).fill(back);
    await proposal.getByRole('button', { name: 'Save' }).click();
  }

  async saveAccepted() {
    await this.page.getByRole('button', { name: 'Save Accepted' }).click();
    await expect(this.page.getByText('Successfully saved accepted flashcards!')).toBeVisible();
    await this.page.waitForURL('**/dashboard', { timeout: 5000 });
  }
} 