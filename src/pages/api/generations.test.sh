#!/bin/bash

# Base URL - adjust as needed
BASE_URL="http://localhost:3000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Testing /api/generations endpoint..."

# Test 1: Valid request with sufficient text length
echo -e "\n${GREEN}Test 1: Valid request with sufficient text length${NC}"
curl -X POST "${BASE_URL}/api/generations" \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a test text that is long enough to meet the minimum requirement of 1000 characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl."}' | jq

# Test 2: Text too short (should fail validation)
echo -e "\n${GREEN}Test 2: Text too short (should fail validation)${NC}"
curl -X POST "${BASE_URL}/api/generations" \
  -H "Content-Type: application/json" \
  -d '{"text": "This is too short"}' | jq

# Test 3: Text too long (should fail validation)
echo -e "\n${GREEN}Test 3: Text too long (should fail validation)${NC}"
curl -X POST "${BASE_URL}/api/generations" \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"$(for i in {1..1000}; do echo -n "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "; done)\"}" | jq

# Test 4: Invalid JSON format
echo -e "\n${GREEN}Test 4: Invalid JSON format${NC}"
curl -X POST "${BASE_URL}/api/generations" \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a test" invalid json' | jq

# Test 5: Missing text field
echo -e "\n${GREEN}Test 5: Missing text field${NC}"
curl -X POST "${BASE_URL}/api/generations" \
  -H "Content-Type: application/json" \
  -d '{}' | jq

# Test 6: Empty text field
echo -e "\n${GREEN}Test 6: Empty text field${NC}"
curl -X POST "${BASE_URL}/api/generations" \
  -H "Content-Type: application/json" \
  -d '{"text": ""}' | jq

echo -e "\n${GREEN}All tests completed${NC}" 