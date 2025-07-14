package com.tenxcards.flashcards.service;

import com.tenxcards.flashcards.dto.FlashcardProposalDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class OpenRouterService {

    static String SYSTEM_PROMPT = "You are a helpful assistant that generates flashcards from text. Create 5-10 high-quality flashcards with a question on the front and an answer on the back. Each flashcard should cover a key concept from the text. Format your response as a JSON array with objects containing \"front\" and \"back\" properties. JSON only, no extra text, tags or delimiters.";

    @Value("${openrouter.api-key}")
    private String apiKey;

    @Value("${openrouter.model}")
    private String model;

    private final String baseUrl = "https://openrouter.ai/api/v1/chat/completions";

    private final RestTemplate restTemplate = new RestTemplate();

    public List<FlashcardProposalDTO> generateFlashcards(String text) {
        System.out.println("Generating flashcards with OpenRouter");
        try {
            String userPrompt = buildPrompt(text);

            List<Map<String, String>> messages = Arrays.asList(
                Map.of("role", "system", "content", SYSTEM_PROMPT),
                Map.of("role", "user", "content", userPrompt)
            );

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("messages", messages);
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 2000);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                baseUrl,
                HttpMethod.POST,
                entity,
                Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map body = response.getBody();
                List choices = (List) body.get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map choice = (Map) choices.get(0);
                    Map message = (Map) choice.get("message");
                    String responseText = (String) message.get("content");
                    return parseFlashcards(responseText);
                }
            }
            return new ArrayList<>();
        } catch (Exception e) {
            System.err.println("Error generating flashcards (OpenRouter): " + e.getMessage());
            throw new RuntimeException(e);
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

    List<FlashcardProposalDTO> parseFlashcards(String responseText) {
        List<FlashcardProposalDTO> flashcards = new ArrayList<>();
        try {
            ObjectMapper mapper = new ObjectMapper();
            flashcards = mapper.readValue(responseText, new TypeReference<List<FlashcardProposalDTO>>() {});
            return flashcards;
        } catch (Exception e) {
            System.out.println("JSON parsing failed, falling back to text format parsing: " + e.getMessage());
            String[] cards = responseText.split("---");
            for (String card : cards) {
                card = card.trim();
                if (card.isEmpty()) continue;
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

    public String getModel() {
        return model;
    }
} 