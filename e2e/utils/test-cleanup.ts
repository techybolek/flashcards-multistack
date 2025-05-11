import { APIRequestContext, expect } from '@playwright/test';

/**
 * Cleans up test data for the currently authenticated user
 * @param request Playwright's request context
 * @returns Promise resolving to the cleanup response
 */
export async function cleanupTestData(request: APIRequestContext): Promise<{
  success: boolean;
  deleted?: {
    flashcards: number;
    generations: number;
    generation_error_logs: number;
  };
  errors?: string[];
}> {
  // The test user must be authenticated to call the cleanup endpoint
  // We assume that either the test is already authenticated or
  // authentication happens in the test before cleanup
  
  const response = await request.post('/api/tests/cleanup', {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  // Assert the response was successful
  expect(response.ok()).toBeTruthy();
  
  return await response.json();
} 