import { describe, it, before, beforeEach } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';

// Setup paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../../../../.env.test') });

// Get test credentials from environment variables
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;

// Skip tests if test credentials are not available
const skipIfNoCredentials = !TEST_USER_EMAIL || !TEST_USER_PASSWORD;

describe('Login API Integration Test', function() {
  // Increase timeout for integration tests
  this.timeout(10000);
  
  // Base URL for API requests
  const API_URL = process.env.TEST_API_URL || 'http://localhost:3000';
  const request = supertest(API_URL);
  
  let serverRunning = false;
  
  // Check if the server is running before all tests
  before(async function() {
    try {
      // Attempt to make a simple request to check if server is running
      const response = await request.get('/').timeout(3000);
      serverRunning = true;
    } catch (error) {
      console.error('🚨 ERROR: Server is not running at ' + API_URL);
      console.error('Please start your server with: npm run dev');
      this.skip();
    }
  });
  
  beforeEach(function() {
    if (!serverRunning) {
      console.warn('⚠️  Skipping test because server is not running');
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
      console.error('Error parsing response text as JSON:', response.text);
      return null;
    }
  };
  
  it('should authenticate with valid credentials and return user data', async function() {
    if (skipIfNoCredentials) {
      console.warn('⚠️  Warning: Missing test credentials. Skipping authentication test.');
      this.skip();
      return;
    }
    
    try {
      const response = await request
        .post('/api/auth/login')
        .send({
          email: TEST_USER_EMAIL,
          password: TEST_USER_PASSWORD
        })
        .set('Content-Type', 'application/json');
      
      // Get the response data
      const data = getResponseData(response);
      console.log('Auth response:', data);
      
      // Verify status code
      expect(response.status).to.equal(200);
      
      // Verify data structure
      expect(data).to.have.property('status', 'success');
      expect(data).to.have.property('redirectTo', '/dashboard');
      expect(data).to.have.property('user');
      expect(data.user).to.have.property('id');
      expect(data.user).to.have.property('email', TEST_USER_EMAIL);
    } catch (error) {
      console.error('Error during test:', error.message);
      throw error;
    }
  });

  it('should return error for invalid credentials', async function() {
    try {
      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'real@example.com',
          password: 'wrongpassword123'
        })
        .set('Content-Type', 'application/json');
      
      const data = getResponseData(response);
      
      expect(response.status).to.equal(400);
      expect(data).to.have.property('status', 'error');
      expect(data).to.have.property('error');
    } catch (error) {
      console.error('Error during test:', error.message);
      throw error;
    }
  });

  it('should return validation error for invalid email format', async function() {
    try {
      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'not-an-email',
          password: 'password123'
        })
        .set('Content-Type', 'application/json');
      
      const data = getResponseData(response);
      
      expect(response.status).to.equal(400);
      expect(data).to.have.property('status', 'error');
      expect(data).to.have.property('error');
      expect(data.error).to.contain('Invalid email');
    } catch (error) {
      console.error('Error during test:', error.message);
      throw error;
    }
  });

  it('should return validation error for too short password', async function() {
    try {
      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: '12345' // Less than 6 characters
        })
        .set('Content-Type', 'application/json');
      
      const data = getResponseData(response);
      
      expect(response.status).to.equal(400);
      expect(data).to.have.property('status', 'error');
      expect(data).to.have.property('error');
      expect(data.error).to.contain('Password must be at least 6 characters');
    } catch (error) {
      console.error('Error during test:', error.message);
      throw error;
    }
  });
}); 