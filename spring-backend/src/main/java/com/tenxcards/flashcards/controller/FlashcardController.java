package com.tenxcards.flashcards.controller;

import com.tenxcards.flashcards.dto.*;
import com.tenxcards.flashcards.entity.Flashcard;
import com.tenxcards.flashcards.entity.FlashcardSource;
import com.tenxcards.flashcards.entity.Generation;
import com.tenxcards.flashcards.entity.User;
import com.tenxcards.flashcards.repository.FlashcardRepository;
import com.tenxcards.flashcards.repository.GenerationRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/flashcards")
public class FlashcardController {
    
    @Autowired
    private FlashcardRepository flashcardRepository;
    
    @Autowired
    private GenerationRepository generationRepository;
    
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    
    @PostMapping
    public ResponseEntity<ApiResponse<FlashcardDTO>> createFlashcard(
            @Valid @RequestBody CreateFlashcardCommand command,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            
            Flashcard flashcard = new Flashcard();
            flashcard.setFront(command.getFront());
            flashcard.setBack(command.getBack());
            flashcard.setSource(FlashcardSource.fromValue(command.getSource()));
            flashcard.setDisplayOrder(command.getDisplayOrder());
            flashcard.setUser(user);
            
            // Set generation if provided
            if (command.getGenerationId() != null) {
                Generation generation = generationRepository.findByIdAndUser(command.getGenerationId(), user)
                        .orElse(null);
                if (generation != null) {
                    flashcard.setGeneration(generation);
                }
            }
            
            flashcard = flashcardRepository.save(flashcard);
            
            FlashcardDTO dto = convertToDTO(flashcard);
            return ResponseEntity.ok(ApiResponse.success(dto));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create flashcard"));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FlashcardDTO>> updateFlashcard(
            @PathVariable Long id,
            @Valid @RequestBody UpdateFlashcardCommand command,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            
            Flashcard flashcard = flashcardRepository.findByIdAndUser(id, user)
                    .orElse(null);
            
            if (flashcard == null) {
                return ResponseEntity.notFound().build();
            }
            
            flashcard.setFront(command.getFront());
            flashcard.setBack(command.getBack());
            flashcard.setSource(FlashcardSource.fromValue(command.getSource()));
            
            flashcard = flashcardRepository.save(flashcard);
            
            FlashcardDTO dto = convertToDTO(flashcard);
            return ResponseEntity.ok(ApiResponse.success(dto));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update flashcard"));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteFlashcard(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            
            Flashcard flashcard = flashcardRepository.findByIdAndUser(id, user)
                    .orElse(null);
            
            if (flashcard == null) {
                return ResponseEntity.notFound().build();
            }
            
            flashcardRepository.delete(flashcard);
            return ResponseEntity.ok(ApiResponse.success("Flashcard deleted successfully"));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete flashcard"));
        }
    }
    
    private FlashcardDTO convertToDTO(Flashcard flashcard) {
        FlashcardDTO dto = new FlashcardDTO();
        dto.setId(flashcard.getId());
        dto.setFront(flashcard.getFront());
        dto.setBack(flashcard.getBack());
        dto.setSource(flashcard.getSource().getValue());
        dto.setCreatedAt(flashcard.getCreatedAt().format(formatter));
        dto.setUpdatedAt(flashcard.getUpdatedAt().format(formatter));
        dto.setDisplayOrder(flashcard.getDisplayOrder());
        
        if (flashcard.getGeneration() != null) {
            dto.setGenerationId(flashcard.getGeneration().getId());
        }
        
        return dto;
    }
}
