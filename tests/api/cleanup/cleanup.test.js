import { describe, it, before, beforeEach } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Setup paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../../../.env') });

// Get test credentials from environment variables
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;

// Skip tests if test credentials are not available
const skipIfNoCredentials = !TEST_USER_EMAIL || !TEST_USER_PASSWORD;

describe('Cleanup API Integration Test', function() {
  // Increase timeout for integration tests
  this.timeout(10000);
  
  // Base URL for API requests
  const API_URL = process.env.TEST_API_URL || 'http://localhost:3000';
  const request = supertest(API_URL);
  
  let serverRunning = false;
  let authToken = null;
  
  // Check if the server is running before all tests
  before(async function() {
    try {
      // Attempt to make a simple request to check if server is running
      await request.get('/').timeout(3000);
      serverRunning = true;

      // Login to get auth token if credentials are available
      if (!skipIfNoCredentials) {
        const loginResponse = await request
          .post('/api/auth/login')
          .send({
            email: TEST_USER_EMAIL,
            password: TEST_USER_PASSWORD
          })
          .set('Content-Type', 'application/json');

        if (loginResponse.status === 200) {
          // Store any cookies received from login
          authToken = loginResponse.headers['set-cookie'];
        } else {
          console.error('Failed to authenticate for cleanup tests');
          this.skip();
        }
      }
    } catch (error) {
      console.error('🚨 ERROR: Server is not running at ' + API_URL);
      console.error('Please start your server with: npm run dev');
      console.error(error);
      this.skip();
    }
  });
  
  beforeEach(function() {
    if (!serverRunning) {
      console.warn('⚠️  Skipping test because server is not running');
      this.skip();
    }
    if (skipIfNoCredentials) {
      console.warn('⚠️  Warning: Missing test credentials. Skipping cleanup test.');
      this.skip();
    }
  });

  // Helper function to parse JSON response regardless of Content-Type
  const getResponseData = (response) => {
    if (!response.text) {
      return null;
    }
    
    try {
      return JSON.parse(response.text);
    } catch (e) {
      console.error('Error parsing response text as JSON:', response.text, e);
      return null;
    }
  };

  it('should handle cleanup endpoint response based on server configuration', async function() {
    const response = await request
      .post('/api/tests/cleanup')
      .set('Cookie', authToken)
      .set('Content-Type', 'application/json');

    console.log('Response headers:', response.headers);
    const data = getResponseData(response);
    console.log('Cleanup response:', data);

    expect(response.status).to.equal(200);

    if (data.status === 200) {
      // When cleanup is enabled
      expect(data).to.have.property('deleted');
      expect(data.deleted).to.have.property('flashcards');
      expect(data.deleted).to.have.property('generations');
      expect(data.deleted).to.have.property('generation_error_logs');
    } else if (data.status === 403) {
      // When cleanup is disabled
      expect(data).to.have.property('error', 'Test cleanup endpoint is not enabled. Set ENABLE_TEST_CLEANUP=true to enable it.');
    } else {
      throw new Error(`Unexpected status: ${data.status}`);
    }
  });

  it('should return 401 when not authenticated', async function() {
    const response = await request
      .post('/api/tests/cleanup')
      .set('Content-Type', 'application/json');

    const data = getResponseData(response);
    
    expect(response.status).to.equal(401);
    expect(data).to.have.property('error', 'Unauthorized');
  });

}); 