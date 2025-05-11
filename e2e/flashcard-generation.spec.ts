import { test, expect } from '@playwright/test';
import { FlashcardGenerationPage } from './pages/FlashcardGenerationPage';
import { AuthPage } from './pages/AuthPage';
import { cleanupTestData } from './utils/test-cleanup';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
// Setup paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load test environment variables
dotenv.config({ path: resolve(__dirname, '../.env.test') });

// Get test credentials from environment variables
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;

// Skip tests if test credentials are not available
const skipIfNoCredentials = !TEST_USER_EMAIL || !TEST_USER_PASSWORD;

test.describe('Flashcard Generation Page', () => {
  let flashcardPage: FlashcardGenerationPage;
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    if (skipIfNoCredentials) {
      test.skip();
      return;
    }
    flashcardPage = new FlashcardGenerationPage(page);
    authPage = new AuthPage(page);
  });

  // Add cleanup after all tests run
  test.afterAll(async ({ request }) => {
    if (skipIfNoCredentials) {
      return;
    }

    // Ensure the user is authenticated for cleanup
    const loginResponse = await request.post('/api/auth/login', {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD
      }
    });
    
    // Verify successful login
    expect(loginResponse.ok()).toBeTruthy();
    const loginData = await loginResponse.json();
    expect(loginData.status).toBe('success');
    expect(loginData.user).toBeTruthy();
    
    // Clean up all test data for the authenticated user
    const result = await cleanupTestData(request);
    console.log(`Test cleanup completed: ${result.success ? 'Success' : 'Failed'}`);
    if (result.deleted) {
      console.log(`Deleted: ${JSON.stringify(result.deleted)}`);
    }
    if (result.errors) {
      console.error(`Cleanup errors: ${result.errors.join(', ')}`);
    }
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    await flashcardPage.goto();
    await expect(page).toHaveURL('/auth/login');
  });

  test('should display generate page elements when authenticated', async ({ page }) => {
    // Login first
    await authPage.goto();
    await authPage.login(TEST_USER_EMAIL!, TEST_USER_PASSWORD!);
    await authPage.expectToBeLoggedIn();
    
    // Navigate to generate page
    await flashcardPage.goto();
    
    // Check for main elements
    await expect(flashcardPage.heading).toBeVisible();
    await expect(flashcardPage.backButton).toBeVisible();
    await expect(flashcardPage.textInput).toBeVisible();
    await expect(flashcardPage.generateButton).toBeVisible();
  });

  test('should handle flashcard generation process', async ({ page }) => {
    // Login first
    await authPage.goto();
    await authPage.login(TEST_USER_EMAIL!, TEST_USER_PASSWORD!);
    await authPage.expectToBeLoggedIn();
    
    // Navigate to generate page
    await flashcardPage.goto();
    
    // Enter valid text and generate
    //read the text from tests/test-data/quantumComputing.md
    const validText = fs.readFileSync(resolve(__dirname, '../tests/test-data/quantumComputing.md'), 'utf8');
    await flashcardPage.fillTextInput(validText);
    await flashcardPage.generate();
    
    // Check for loading state
    //await expect(flashcardPage.loadingIndicator).toBeVisible();
    
    // Wait for generation to complete
    await flashcardPage.waitForProposals();
  });

  test('should handle invalid text input', async ({ page }) => {
    // Login first
    await authPage.goto();
    await authPage.login(TEST_USER_EMAIL!, TEST_USER_PASSWORD!);
    await authPage.expectToBeLoggedIn();
    
    // Navigate to generate page
    await flashcardPage.goto();
    
    // Enter invalid text
    await flashcardPage.fillTextInput('Too short');
    
    // Check for error state
    await flashcardPage.expectInvalidInputError();
  });

  test('should handle flashcard proposal interactions', async ({ page }) => {
    // Login first
    await authPage.goto();
    await authPage.login(TEST_USER_EMAIL!, TEST_USER_PASSWORD!);
    await authPage.expectToBeLoggedIn();
    
    // Navigate to generate page
    await flashcardPage.goto();
    
    // Enter valid text and generate
    const validText = fs.readFileSync(resolve(__dirname, '../tests/test-data/quantumComputing.md'), 'utf8');
    await flashcardPage.fillTextInput(validText);
    //wait 
    await page.waitForTimeout(50);
    await flashcardPage.generate();
    
    // Wait for proposals to be loaded and interactive
    await flashcardPage.waitForProposals();
    
    // Get the first proposal
    const firstProposal = await flashcardPage.getFirstProposal();
    
    // Wait for the proposal to be in pending state and interactive
    await expect(firstProposal.getByRole('button', { name: 'Edit' })).toBeEnabled();
    await expect(firstProposal.getByRole('button', { name: 'Accept' })).toBeEnabled();
    await expect(firstProposal.getByRole('button', { name: 'Reject' })).toBeEnabled();
    
    // Edit the proposal
    await flashcardPage.editProposal(firstProposal, 'Edited Front', 'Edited Back');
    
    // Accept the proposal
    //await flashcardPage.acceptProposal(firstProposal);
    
    // Save accepted/edited proposals
    await flashcardPage.saveAccepted();
  });
}); 