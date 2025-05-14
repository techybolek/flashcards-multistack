# E2E Testing

This directory contains end-to-end tests for the application using Playwright.

## Test Cleanup

To ensure test isolation and avoid data pollution between test runs, we use a test cleanup utility that removes all test data after each test suite completes.

### How it works

1. Each test suite should use the `cleanupTestData` utility in an `afterAll` hook:

```typescript
test.afterAll(async ({ request }) => {
  // First authenticate
  const loginResponse = await request.post('/api/auth/login', {
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD
    }
  });
  
  // Then clean up data
  await cleanupTestData(request);
});
```

2. The utility calls a protected API endpoint (`/api/tests/cleanup`) that:
   - Only works in non-production environments
   - Requires the user to be authenticated (same auth pattern as other APIs)
   - Deletes all records associated with the currently authenticated user:
     - Flashcards
     - Generations
     - Generation error logs

### Important notes

- The cleanup endpoint requires the user to be authenticated with Supabase
- Authentication is performed by calling the `/api/auth/login` endpoint before cleanup
- The endpoint doesn't need any additional parameters - it uses the authenticated user's ID

### Environment setup

You need to set the following environment variables:

```
TEST_USER_EMAIL=your-test-user@example.com
TEST_USER_PASSWORD=your-test-user-password
```

These can be set in the `.env` file in the project root.

## Test isolation

To ensure tests don't interfere with each other:

1. Each test uses its own independent browser context
2. Tests should avoid creating data with hardcoded IDs
3. After all tests complete, the cleanup utility ensures no test data remains

## Extending the cleanup utility

If you add new database tables that need to be cleaned up after tests, you'll need to:

1. Add them to the `/api/tests/cleanup` endpoint in `src/pages/api/tests/cleanup.ts`
2. Update the return type in `cleanupTestData` function in `e2e/utils/test-cleanup.ts` 