package com.tenxcards.flashcards.controller;

import com.tenxcards.flashcards.dto.ApiResponse;
import com.tenxcards.flashcards.entity.Generation;
import com.tenxcards.flashcards.entity.User;
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

    private static void assertEquals(Object expected, Object actual) {
        if (!java.util.Objects.equals(expected, actual)) {
            throw new RuntimeException("Assertion failed: expected [" + expected + "] but found [" + actual + "]");
        }
    }

    @GetMapping("/integration")
    public ResponseEntity<ApiResponse<String>> runIntegrationTest() {
        return ResponseEntity.ok(ApiResponse.success("OK", "Integration test endpoint reached successfully."));
    }

    @GetMapping("/create-generation")
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





        return ResponseEntity.ok(ApiResponse.success("OK", "Test generation created successfully."));
    }
}
