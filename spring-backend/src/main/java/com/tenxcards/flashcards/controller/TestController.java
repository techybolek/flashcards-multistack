package com.tenxcards.flashcards.controller;

import com.tenxcards.flashcards.dto.ApiResponse;
import com.tenxcards.flashcards.entity.Flashcard;
import com.tenxcards.flashcards.entity.FlashcardSource;
import com.tenxcards.flashcards.entity.Generation;
import com.tenxcards.flashcards.entity.User;
import com.tenxcards.flashcards.repository.FlashcardRepository;
import com.tenxcards.flashcards.repository.GenerationRepository;
import java.time.Duration;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
@Profile("dev")
public class TestController {

    @Autowired
    private GenerationRepository generationRepository;

    @Autowired
    private FlashcardRepository flashcardRepository;

    private static void assertEquals(Object expected, Object actual) {
        if (!java.util.Objects.equals(expected, actual)) {
            throw new RuntimeException("Assertion failed: expected [" + expected + "] but found [" + actual + "]");
        }
    }

    @GetMapping("/integration1")
    public ResponseEntity<ApiResponse<String>> createTestGeneration() {
        User user = new User();
        user.setId(UUID.fromString("3bd2de75-e9c2-4d7b-9079-8d76f8a048e4"));

        Generation generation = new Generation();
        generation.setName("Test Generation");
        generation.setUser(user);
        generation.setGeneratedCount(10);
        generation.setAcceptedUneditedCount(5);
        generation.setAcceptedEditedCount(3);
        generation.setSourceTextLength(1000);
        generation.setGenerationDuration(Duration.ofMinutes(1));
        generation.setModel("gpt-4");
        generation.setSourceTextHash("test-hash");

        generationRepository.save(generation);

        //reselect
        Generation savedGeneration = generationRepository.findById(generation.getId()).orElseThrow(() -> new RuntimeException("Generation not found"));
        //assert id
        assertEquals(generation.getId(), savedGeneration.getId());
        assertEquals(generation.getGeneratedCount(), savedGeneration.getGeneratedCount());
        assertEquals(generation.getAcceptedUneditedCount(), savedGeneration.getAcceptedUneditedCount());
        assertEquals(generation.getAcceptedEditedCount(), savedGeneration.getAcceptedEditedCount());
        assertEquals(generation.getSourceTextLength(), savedGeneration.getSourceTextLength());
        assertEquals(generation.getGenerationDuration(), savedGeneration.getGenerationDuration());
        assertEquals(generation.getModel(), savedGeneration.getModel());

        // Create and save flashcards
        Flashcard flashcard1 = new Flashcard("What is Java?", "A programming language.", FlashcardSource.AI_FULL, 1, user, savedGeneration);
        Flashcard flashcard2 = new Flashcard("What is SQL?", "A query language for databases.", FlashcardSource.AI_FULL, 2, user, savedGeneration);

        flashcardRepository.save(flashcard1);
        flashcardRepository.save(flashcard2);

        // Assertions for flashcards
        Flashcard savedFlashcard1 = flashcardRepository.findById(flashcard1.getId()).orElseThrow(() -> new RuntimeException("Flashcard 1 not found"));
        assertEquals(flashcard1.getFront(), savedFlashcard1.getFront());
        assertEquals(savedGeneration.getId(), savedFlashcard1.getGeneration().getId());

        Flashcard savedFlashcard2 = flashcardRepository.findById(flashcard2.getId()).orElseThrow(() -> new RuntimeException("Flashcard 2 not found"));
        assertEquals(flashcard2.getBack(), savedFlashcard2.getBack());
        assertEquals(savedGeneration.getId(), savedFlashcard2.getGeneration().getId());

        //reselect the generation and verify that the flashcards are still there
        Generation reselectedGeneration = generationRepository.findById(savedGeneration.getId()).orElseThrow(() -> new RuntimeException("Generation not found"));
        assertEquals(savedGeneration.getId(), reselectedGeneration.getId());
        assertEquals(savedGeneration.getGeneratedCount(), reselectedGeneration.getGeneratedCount());
        assertEquals(savedGeneration.getAcceptedUneditedCount(), reselectedGeneration.getAcceptedUneditedCount());
        assertEquals(savedGeneration.getAcceptedEditedCount(), reselectedGeneration.getAcceptedEditedCount());
        assertEquals(savedGeneration.getSourceTextLength(), reselectedGeneration.getSourceTextLength());
        //delete the generation and all flashcards associated with it
        generationRepository.delete(savedGeneration);

        //attempt to reselect the generation and verify that it is null
        Generation reselectedGeneration2 = generationRepository.findById(savedGeneration.getId()).orElse(null);
        assertEquals(reselectedGeneration2, null);

        return ResponseEntity.ok(ApiResponse.success("OK", "SUCCESS"));

    }
}
