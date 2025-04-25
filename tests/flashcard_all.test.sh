#!/bin/bash

# Test script for the flashcards API endpoint
# This script tests the GET endpoint that retrieves all flashcards

echo "Testing GET /api/flashcards endpoint..."

# Make the request to the API
response=$(curl -s -X GET "http://localhost:3000/api/flashcards" -H "Content-Type: application/json")

# Check if the response contains data
if echo "$response" | grep -q "data"; then
  echo "✅ Test passed: Successfully retrieved flashcards"
  echo "Response:"
  echo "$response" | jq
else
  echo "❌ Test failed: Could not retrieve flashcards"
  echo "Response:"
  echo "$response"
fi 