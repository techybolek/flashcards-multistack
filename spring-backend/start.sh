#!/bin/bash

# Start script for 10x Cards Spring Boot Backend
echo "Starting 10x Cards Spring Boot Backend..."

# Check if OPENAI_API_KEY is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "Warning: OPENAI_API_KEY not set. Using mock AI service."
fi

# Set default JWT secret if not provided
if [ -z "$JWT_SECRET" ]; then
    export JWT_SECRET="mySecretKey1234567890123456789012345678901234567890"
    echo "Using default JWT secret (for development only)"
fi

# Start the application
mvn spring-boot:run