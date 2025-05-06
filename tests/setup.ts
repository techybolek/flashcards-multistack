import { beforeAll, afterAll, afterEach, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Mock global objects if needed
// For example, if you need to mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Setup and teardown
beforeAll(() => {
  // Global setup before all tests
});

afterAll(() => {
  // Global cleanup after all tests
});

afterEach(() => {
  // Cleanup after each test
  vi.restoreAllMocks();
}); 