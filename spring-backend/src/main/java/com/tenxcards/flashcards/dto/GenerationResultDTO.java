package com.tenxcards.flashcards.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class GenerationResultDTO {
    
    @JsonProperty("generation_id")
    private Long generationId;
    
    @JsonProperty("generation_name")
    private String generationName;
    
    @JsonProperty("flashcardProposals")
    private List<FlashcardProposalDTO> flashcardProposals;
    
    private GenerationStatsDTO stats;
    
    // Constructors
    public GenerationResultDTO() {}
    
    public GenerationResultDTO(Long generationId, String generationName, List<FlashcardProposalDTO> flashcardProposals, GenerationStatsDTO stats) {
        this.generationId = generationId;
        this.generationName = generationName;
        this.flashcardProposals = flashcardProposals;
        this.stats = stats;
    }
    
    // Getters and Setters
    public Long getGenerationId() {
        return generationId;
    }
    
    public void setGenerationId(Long generationId) {
        this.generationId = generationId;
    }
    
    public String getGenerationName() {
        return generationName;
    }
    
    public void setGenerationName(String generationName) {
        this.generationName = generationName;
    }
    
    public List<FlashcardProposalDTO> getFlashcardProposals() {
        return flashcardProposals;
    }
    
    public void setFlashcardProposals(List<FlashcardProposalDTO> flashcardProposals) {
        this.flashcardProposals = flashcardProposals;
    }
    
    public GenerationStatsDTO getStats() {
        return stats;
    }
    
    public void setStats(GenerationStatsDTO stats) {
        this.stats = stats;
    }
}