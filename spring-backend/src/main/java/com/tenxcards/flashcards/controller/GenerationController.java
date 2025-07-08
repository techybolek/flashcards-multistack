package com.tenxcards.flashcards.controller;

import com.tenxcards.flashcards.dto.*;
import com.tenxcards.flashcards.entity.Flashcard;
import com.tenxcards.flashcards.entity.FlashcardSource;
import com.tenxcards.flashcards.entity.Generation;
import com.tenxcards.flashcards.entity.User;
import com.tenxcards.flashcards.repository.FlashcardRepository;
import com.tenxcards.flashcards.repository.GenerationRepository;
import com.tenxcards.flashcards.security.UserPrincipal;
import com.tenxcards.flashcards.service.OpenAIService;
import com.tenxcards.flashcards.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/generations")
public class GenerationController {
    
    @Autowired
    private GenerationRepository generationRepository;
    
    @Autowired
    private FlashcardRepository flashcardRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private OpenAIService openAIService;
    
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    
    @PostMapping
    public ResponseEntity<ApiResponse<GenerationResultDTO>> generateFlashcards(
            @Valid @RequestBody GenerateFlashcardsCommand command,
            Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User user = userService.findById(userPrincipal.getId());
            
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("User not found"));
            }
            
            LocalDateTime startTime = LocalDateTime.now();
            
            // Generate flashcards using AI
            List<FlashcardProposalDTO> proposals = openAIService.generateFlashcards(command.getText());
            
            LocalDateTime endTime = LocalDateTime.now();
            Duration duration = Duration.between(startTime, endTime);
            
            // Create generation record
            Generation generation = new Generation();
            generation.setName("Generation " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
            generation.setUser(user);
            generation = generationRepository.save(generation);
            
            // Create stats
            GenerationStatsDTO stats = new GenerationStatsDTO();
            stats.setGeneratedCount(proposals.size());
            stats.setGenerationDuration("PT" + duration.getSeconds() + "S");
            
            // Create result DTO
            GenerationResultDTO result = new GenerationResultDTO();
            result.setGenerationId(generation.getId());
            result.setGenerationName(generation.getName());
            result.setFlashcardProposals(proposals);
            result.setStats(stats);
            
            return ResponseEntity.ok(ApiResponse.success(result));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to generate flashcards"));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getGenerations(Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User user = userService.findById(userPrincipal.getId());
            
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("User not found"));
            }
            
            List<Generation> generations = generationRepository.findByUserOrderByCreatedAtDesc(user);
            
            List<Map<String, Object>> generationData = generations.stream()
                    .map(this::convertGenerationToMap)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(ApiResponse.success(generationData));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve generations"));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getGeneration(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User user = userService.findById(userPrincipal.getId());
            
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("User not found"));
            }
            
            Generation generation = generationRepository.findByIdAndUser(id, user)
                    .orElse(null);
            
            if (generation == null) {
                return ResponseEntity.notFound().build();
            }
            
            List<Flashcard> flashcards = flashcardRepository.findByGenerationOrderByDisplayOrder(generation);
            
            Map<String, Object> generationData = convertGenerationToMap(generation);
            List<FlashcardDTO> flashcardDTOs = flashcards.stream()
                    .map(this::convertFlashcardToDTO)
                    .collect(Collectors.toList());
            generationData.put("flashcards", flashcardDTOs);
            
            return ResponseEntity.ok(ApiResponse.success(generationData));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve generation"));
        }
    }
    
    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<String>> updateGeneration(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updateData,
            Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User user = userService.findById(userPrincipal.getId());
            
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("User not found"));
            }
            
            Generation generation = generationRepository.findByIdAndUser(id, user)
                    .orElse(null);
            
            if (generation == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Delete existing flashcards for this generation
            flashcardRepository.deleteByGeneration(generation);
            
            // Create new flashcards from the update data
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> flashcardsData = (List<Map<String, Object>>) updateData.get("flashcards");
            
            if (flashcardsData != null) {
                for (int i = 0; i < flashcardsData.size(); i++) {
                    Map<String, Object> flashcardData = flashcardsData.get(i);
                    
                    Flashcard flashcard = new Flashcard();
                    flashcard.setFront((String) flashcardData.get("front"));
                    flashcard.setBack((String) flashcardData.get("back"));
                    flashcard.setSource(FlashcardSource.fromValue((String) flashcardData.get("source")));
                    flashcard.setDisplayOrder(i + 1);
                    flashcard.setUser(user);
                    flashcard.setGeneration(generation);
                    
                    flashcardRepository.save(flashcard);
                }
            }
            
            return ResponseEntity.ok(ApiResponse.success("Generation updated successfully"));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update generation"));
        }
    }
    
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<String>> deleteGeneration(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User user = userService.findById(userPrincipal.getId());
            
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("User not found"));
            }
            
            Generation generation = generationRepository.findByIdAndUser(id, user)
                    .orElse(null);
            
            if (generation == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Delete all flashcards associated with this generation
            flashcardRepository.deleteByGeneration(generation);
            
            // Delete the generation
            generationRepository.delete(generation);
            
            return ResponseEntity.ok(ApiResponse.success("Generation deleted successfully"));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete generation"));
        }
    }
    
    private Map<String, Object> convertGenerationToMap(Generation generation) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", generation.getId());
        map.put("name", generation.getName());
        map.put("created_at", generation.getCreatedAt().format(formatter));
        map.put("updated_at", generation.getUpdatedAt().format(formatter));
        map.put("user_id", generation.getUser().getId().toString());
        return map;
    }
    
    private FlashcardDTO convertFlashcardToDTO(Flashcard flashcard) {
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