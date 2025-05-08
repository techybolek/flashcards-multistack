# API Integration Tests

These integration tests directly communicate with the application's real API endpoints to verify the functionality without mocks.

## Authentication Tests

The login endpoint test (`login.test.js`) requires real credentials to fully test the authentication flow.

### Setup

1. Create a `.env.test` file in the project root with the following variables:

```
TEST_USER_EMAIL=your_test_user@example.com
TEST_USER_PASSWORD=your_test_password
TEST_API_URL=http://localhost:3000
```

2. Ensure you've created this test user in your Supabase instance beforehand.

3. Make sure Supertest is installed:

```bash
npm install --save-dev supertest
```

### Running the Tests

⚠️ **IMPORTANT**: Make sure your server is running before executing the tests!

```bash
# First, start your server in a separate terminal
npm run dev

# Then in another terminal, run the tests
```

You can run the tests using Mocha directly:

```bash
# Run all integration tests
npx mocha tests/integration/**/*.test.js

# Or run specifically the auth integration tests
npx mocha tests/integration/api/auth/*.test.js
```

Alternatively, you can use the script in package.json:

```bash
npm run test:integration
```

### Important Notes

- The tests are designed to skip when credentials are unavailable
- The tests will also skip if your server is not running
- These tests should not run in CI environments with real credentials unless you're using a dedicated testing environment
- For local development, consider using a separate Supabase project specifically for testing

### Test Coverage

These tests verify:

1. Successful login with valid credentials
2. Error response for invalid credentials
3. Validation errors for invalid input formats
4. Input validation for email and password requirements 