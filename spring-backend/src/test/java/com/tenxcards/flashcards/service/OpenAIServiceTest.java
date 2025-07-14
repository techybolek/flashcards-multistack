package com.tenxcards.flashcards.service;

import com.tenxcards.flashcards.dto.FlashcardProposalDTO;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class OpenAIServiceTest {

    @Autowired
    private OpenAIService service;

    @BeforeAll
    static void setup() {
        // Ensure the property is set before the Spring context loads
        System.setProperty("openai.api-key", System.getenv("OPENAI_API_KEY"));
    }

    @Test
    void testParseFlashcardsWithJsonFormat() {
        String json = """
            [
              {
                "front": "What is a qubit?",
                "back": "Unlike classical bits which are either 0 or 1, qubits can exist in a superposition of both states simultaneously, allowing for parallel computation."
              },
              {
                "front": "What is superposition in quantum computing?",
                "back": "A qubit can represent multiple values at once, enabling quantum computers to explore numerous possibilities concurrently."
              }
            ]
            """;

        List<FlashcardProposalDTO> result = service.parseFlashcards(json);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("What is a qubit?", result.get(0).getFront());
        assertEquals(
            "Unlike classical bits which are either 0 or 1, qubits can exist in a superposition of both states simultaneously, allowing for parallel computation.",
            result.get(0).getBack());
        assertEquals("What is superposition in quantum computing?", result.get(1).getFront());
        assertEquals(
            "A qubit can represent multiple values at once, enabling quantum computers to explore numerous possibilities concurrently.",
            result.get(1).getBack());

        for (FlashcardProposalDTO card : result) {
            System.out.println("Front: " + card.getFront());
            System.out.println("Back: " + card.getBack());
            System.out.println("---");
        }
    }

    @Test
    void testGenerateFlashcardsWithRealApiCall() {
        String sampleText = "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water.";
        List<FlashcardProposalDTO> result = service.generateFlashcards(sampleText);


        for (FlashcardProposalDTO card : result) {
            System.out.println("Front: " + card.getFront());
            System.out.println("Back: " + card.getBack());
            System.out.println("---");
        }
        assertNotNull(result, "Result should not be null");
        assertFalse(result.isEmpty(), "Result should contain at least one flashcard");
        assertNotNull(result.get(0).getFront(), "Flashcard front should not be null");
        assertNotNull(result.get(0).getBack(), "Flashcard back should not be null");
    }
}