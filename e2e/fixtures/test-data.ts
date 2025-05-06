/**
 * Test data for E2E tests
 */
export const TestData = {
  messages: {
    short: 'Hello world',
    long: 'This is a longer message that spans multiple lines and tests how the system handles longer content. It should be processed correctly and displayed properly in the UI.',
    withSpecialChars: 'Test with special characters: !@#$%^&*()_+<>?',
    withMarkdown: '# Heading\n\n- List item 1\n- List item 2\n\n```code block```',
  },
  users: {
    standard: {
      name: 'Test User',
      email: 'test@example.com',
    },
    admin: {
      name: 'Admin User',
      email: 'admin@example.com',
    },
  },
}; 