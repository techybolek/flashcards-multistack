import { expect } from 'chai';
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3000/api';
const FLASHCARDS_ENDPOINT = `${API_BASE_URL}/flashcards`;

describe('Flashcards API', () => {
  let testFlashcardId;

  // Test data
  const testFlashcard = {
    front: 'What is Astro?',
    back: 'A web framework for building content-driven websites.',
    source: 'manual'
  };

  describe('GET /api/flashcards', () => {
    it('should return all flashcards', async () => {
      const response = await fetch(FLASHCARDS_ENDPOINT);
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data).to.have.property('data');
      expect(data.data).to.be.an('array');
    });
  });

  describe('POST /api/flashcards', () => {
    it('should create a new flashcard', async () => {
      const response = await fetch(FLASHCARDS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testFlashcard)
      });

      const data = await response.json();

      expect(response.status).to.equal(201);
      expect(data).to.have.property('data');
      expect(data.data).to.have.property('front', testFlashcard.front);
      expect(data.data).to.have.property('back', testFlashcard.back);
      expect(data.data).to.have.property('source', testFlashcard.source);

      // Store the ID for potential future tests
      testFlashcardId = data.data.id;
    });

    it('should return 400 when required fields are missing', async () => {
      const invalidFlashcard = {
        front: 'What is Astro?'
        // missing back and source
      };

      const response = await fetch(FLASHCARDS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invalidFlashcard)
      });

      const data = await response.json();

      expect(response.status).to.equal(400);
      expect(data).to.have.property('error');
      expect(data.error).to.include("Fields 'front', 'back', and 'source' are required");
    });

    it('should return 500 when source field has an invalid value', async () => {
      const invalidFlashcard = {
        front: 'What is Astro?',
        back: 'A web framework for building content-driven websites.',
        source: 'invalid-source' // Invalid source value
      };

      const response = await fetch(FLASHCARDS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invalidFlashcard)
      });

      const data = await response.json();

      console.log('error data', data);
      expect(response.status).to.equal(500);
      expect(data).to.have.property('error');
      expect(data).to.have.property('details');
      expect(data.details).to.include("flashcards_source_check")
    });
  });
});

describe('Bulk Flashcards API', () => {
  const BULK_FLASHCARDS_ENDPOINT = `${API_BASE_URL}/flashcards/bulk`;

  describe('POST /api/flashcards/bulk', () => {
    it('should create multiple flashcards in bulk', async () => {
      const bulkFlashcards = [
        {
          front: 'What is React?',
          back: 'A JavaScript library for building user interfaces.',
          source: 'manual'
        },
        {
          front: 'What is TypeScript?',
          back: 'A typed superset of JavaScript that compiles to plain JavaScript.',
          source: 'manual'
        }
      ];

      const response = await fetch(BULK_FLASHCARDS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bulkFlashcards)
      });

      expect(response.status).to.equal(201);
    });

    it('should return 400 when a flashcard is missing required fields', async () => {
      const invalidFlashcards = [
        {
          front: 'What is React?',
          back: 'A JavaScript library for building user interfaces.',
          source: 'manual'
        },
        {
          front: 'What is TypeScript?'
          // missing back field
        }
      ];

      const response = await fetch(BULK_FLASHCARDS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invalidFlashcards)
      });

      const data = await response.json();

      expect(response.status).to.equal(400);
      expect(data).to.have.property('error');
      expect(data.error).to.equal("Each flashcard must include a 'front' and a 'back'");
    });
  });
}); 