# 10x Cards - Flashcard Generation App

A web application for generating and managing flashcards using AI.

## Environment Variables

To run this application, you need to set up the following environment variables:

1. Create a `.env` file in the root directory of the project.
2. Add the following variables:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key (optional)
OPENAI_API_KEY=your_openai_api_key
```

### Getting an OpenAI API Key

To use the flashcard generation feature, you need an OpenAI API key:

1. Sign up for an OpenAI account at [https://platform.openai.com](https://platform.openai.com)
2. Navigate to your API keys section
3. Generate a new API key
4. Add the API key to your `.env` file as `OPENAI_API_KEY`

## Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Testing

```bash
# Run tests
npm test
```

## Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
``` 