import { OpenRouterService } from '../src/lib/openrouter';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  // Get API key from environment
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('OPENROUTER_API_KEY environment variable is not set');
    process.exit(1);
  }

  // Create OpenRouter service
  const openRouter = new OpenRouterService({
    apiKey,
    defaultModel: 'qwen/qwen-2.5-7b-instruct',
    cacheEnabled: false
  });

  try {
    // Test chat completion
    console.log('Testing chat completion...');
    const response = await openRouter.chat([
      {
        role: 'user',
        content: 'What is the meaning of life?'
      }
    ]);
    
    console.log('Response:', response.content);
    
    // Test getting available models
    console.log('\nTesting getAvailableModels...');
    const models = await openRouter.getAvailableModels();
    console.log(`Found ${models.length} models`);
    
    // Print first 3 models
    models.slice(0, 3).forEach(model => {
      console.log(`- ${model.id} (context_length: ${model.context_length})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error); 