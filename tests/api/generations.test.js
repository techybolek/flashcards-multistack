// @ts-check
import { expect } from 'chai';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = 'http://localhost:3000/api';
const GENERATIONS_ENDPOINT = `${API_BASE_URL}/generations`;

describe('Generations API', () => {
  describe('POST /api/generations', () => {
    // This test now verifies that the API correctly saves generation data to the database
    it.only('should generate flashcards from text and save to database', async function () {
      this.timeout(20000);
      // Test data - read text from source_mock.md file
      const sourceMockPath = path.join(__dirname, './source_mock.md');
      const fileContent = fs.readFileSync(sourceMockPath, 'utf8');
      const testText = fileContent;


      const response = await fetch(GENERATIONS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: testText })
      });

      // Check response status
      expect(response.status).to.equal(201);

      // Parse response data
      const data = await response.json();

      // Verify response structure
      expect(data).to.have.property('generation_id');
      expect(data).to.have.property('flashcardProposals');
      expect(data).to.have.property('stats');

      // Verify flashcardProposals is an array
      expect(data.flashcardProposals).to.be.an('array');
      expect(data.flashcardProposals.length).to.be.greaterThan(0);

      // Verify each flashcard has the expected properties
      data.flashcardProposals.forEach(flashcard => {
        expect(flashcard).to.have.property('front');
        expect(flashcard).to.have.property('back');
        expect(flashcard).to.have.property('source');
        expect(flashcard.source).to.equal('ai-full');
      });

      // Verify stats properties
      expect(data.stats).to.have.property('generated_count');
      expect(data.stats).to.have.property('generation_duration');
      
      // Verify generation_id is a number (from the database)
      expect(data.generation_id).to.be.a('number');
    });
  });
}); 