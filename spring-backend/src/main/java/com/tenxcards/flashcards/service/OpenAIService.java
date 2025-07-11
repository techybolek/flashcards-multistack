package com.tenxcards.flashcards.service;

import com.tenxcards.flashcards.dto.FlashcardProposalDTO;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class OpenAIService {


    static String SYSTEM_PROMPT = "You are a helpful assistant that generates flashcards from text. Create 5-10 high-quality flashcards with a question on the front and an answer on the back. Each flashcard should cover a key concept from the text. Format your response as a JSON array with objects containing \"front\" and \"back\" properties. JSON only, no extra text, tags or delimiters.";
    
    @Value("${openai.api-key}")
    private String apiKey;
    
    @Value("${openai.model}")
    private String model;

    public String getModel() {
        return model;
    }
    
    private OpenAiService openAiService;
    
    private OpenAiService getOpenAiService() {
        if (openAiService == null) {
            openAiService = new OpenAiService(apiKey, Duration.ofSeconds(30));
        }
        return openAiService;
    }
    
    public List<FlashcardProposalDTO> generateFlashcards(String text) {
        try {
            String userPrompt = buildPrompt(text);
            
            ChatMessage systemMessage = new ChatMessage(ChatMessageRole.SYSTEM.value(), SYSTEM_PROMPT);
            ChatMessage userMessage = new ChatMessage(ChatMessageRole.USER.value(), userPrompt);
            
            ChatCompletionRequest request = ChatCompletionRequest.builder()
                    .model(model)
                    .messages(Arrays.asList(systemMessage, userMessage))
                    .temperature(0.7)
                    .maxTokens(2000)
                    .build();
            
            ChatCompletionResult result = getOpenAiService().createChatCompletion(request);
            
            if (result.getChoices() != null && !result.getChoices().isEmpty()) {
                String responseText = result.getChoices().get(0).getMessage().getContent();
                return parseFlashcards(responseText);
            }
            
            return new ArrayList<>();
            
        } catch (Exception e) {
            System.err.println("Error generating flashcards: " + e.getMessage());
            throw e;
        }
    }
    
    private String buildPrompt(String text) {
        return String.format(
            "Create flashcards from the following text. Generate 5-10 flashcards that cover the key concepts, definitions, and important information.\n\n" +
            "Format each flashcard as:\n" +
            "FRONT: [question or prompt]\n" +
            "BACK: [answer or explanation]\n" +
            "---\n\n" +
            "Make the questions clear and concise. Make the answers informative but not too long.\n\n" +
            "Text to process:\n%s", text
        );
    }
    
    // Change from private to package-private for testing
    List<FlashcardProposalDTO> parseFlashcards(String responseText) {
        List<FlashcardProposalDTO> flashcards = new ArrayList<>();
        
        // First try to parse as JSON
        try {
            ObjectMapper mapper = new ObjectMapper();
            flashcards = mapper.readValue(responseText, new TypeReference<List<FlashcardProposalDTO>>() {});
            return flashcards;
        } catch (Exception e) {
            // If JSON parsing fails, fall back to text format parsing
            System.out.println("JSON parsing failed, falling back to text format parsing: " + e.getMessage());
            
            // Split by --- separator
            String[] cards = responseText.split("---");
            
            for (String card : cards) {
                card = card.trim();
                if (card.isEmpty()) continue;
                
                // Extract FRONT and BACK using regex
                Pattern frontPattern = Pattern.compile("FRONT:\\s*(.+?)(?=BACK:|$)", Pattern.DOTALL);
                Pattern backPattern = Pattern.compile("BACK:\\s*(.+?)(?=FRONT:|$)", Pattern.DOTALL);
                
                Matcher frontMatcher = frontPattern.matcher(card);
                Matcher backMatcher = backPattern.matcher(card);
                
                if (frontMatcher.find() && backMatcher.find()) {
                    String front = frontMatcher.group(1).trim();
                    String back = backMatcher.group(1).trim();
                    
                    if (!front.isEmpty() && !back.isEmpty()) {
                        flashcards.add(new FlashcardProposalDTO(front, back));
                    }
                }
            }
        }
        
        return flashcards;
    }
    
    private List<FlashcardProposalDTO> generateMockFlashcards(String text) {
        // Fallback mock flashcards for testing when OpenAI is not available
        List<FlashcardProposalDTO> mockFlashcards = new ArrayList<>();
        
        mockFlashcards.add(new FlashcardProposalDTO(
            "What is the main topic of this text?",
            "The main topic is extracted from the provided text content."
        ));
        
        mockFlashcards.add(new FlashcardProposalDTO(
            "What are the key concepts mentioned?",
            "The key concepts are the important ideas and terms found in the text."
        ));
        
        mockFlashcards.add(new FlashcardProposalDTO(
            "What is the significance of this information?",
            "This information is significant because it provides educational value and learning opportunities."
        ));
        
        return mockFlashcards;
    }
}