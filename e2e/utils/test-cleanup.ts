import { APIRequestContext } from '@playwright/test';

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
  skipped?: boolean;
}> {
  try {
    const response = await request.post('/api/tests/cleanup', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // If cleanup is not enabled, the endpoint will return 403
    if (response.status() === 403) {
      console.warn('Test cleanup is not enabled. Test data will persist. Set ENABLE_TEST_CLEANUP=true to enable cleanup.');
      return {
        success: true,
        skipped: true
      };
    }
    
    // For other errors, return the error response
    if (!response.ok()) {
      const errorData = await response.json();
      return {
        success: false,
        errors: [errorData.error || 'Unknown error during cleanup']
      };
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Error during test cleanup:', error);
    return {
      success: false,
      errors: [(error as Error).message]
    };
  }
} 