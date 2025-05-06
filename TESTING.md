# Testing Documentation

This project uses a comprehensive testing approach with both unit tests (Vitest) and end-to-end tests (Playwright).

## Tech Stack

- **Unit Testing**: Vitest with React Testing Library and JSDOM
- **E2E Testing**: Playwright with Page Object Model pattern
- **Coverage**: V8 coverage provider

## Directory Structure

```
├── tests/                  # Unit tests
│   ├── setup.ts            # Vitest setup file
│   └── unit/               # Unit test files
│       ├── components/     # Component tests
│       └── lib/            # Library/utility tests
├── e2e/                    # End-to-end tests
│   ├── fixtures/           # Test fixtures
│   ├── pages/              # Page Object Models
│   └── utils/              # Test utilities
├── playwright.config.ts    # Playwright configuration
└── vitest.config.ts        # Vitest configuration
```

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm test

# Watch mode for development
npm run test:watch

# Open UI for interactive testing
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Open UI for interactive testing
npm run test:e2e:ui

# Debug mode with browser
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

## Unit Testing Guidelines

- Use `vi` object for test doubles: `vi.fn()`, `vi.spyOn()`, and `vi.stubGlobal()`
- Follow the AAA pattern: Arrange, Act, Assert
- Use `describe` blocks to group related tests
- Use mocks sparingly and prefer spies when possible
- Leverage inline snapshots for readable assertions
- Use meaningful test names describing the expected behavior

## E2E Testing Guidelines

- Follow the Page Object Model pattern
- Only use Chromium/Desktop Chrome browser
- Use locators for resilient element selection
- Implement visual comparison with screenshots
- Set up isolated browser contexts for test independence
- Use expect assertions with specific matchers

## Best Practices

1. Write tests for business-critical paths first
2. Balance test coverage with development speed
3. Keep tests fast and independent
4. Test behavior, not implementation
5. Maintain test readability and simplicity
6. Use test doubles judiciously 