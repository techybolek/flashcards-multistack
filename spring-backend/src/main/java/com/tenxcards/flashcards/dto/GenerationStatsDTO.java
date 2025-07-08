package com.tenxcards.flashcards.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GenerationStatsDTO {
    
    @JsonProperty("generated_count")
    private Integer generatedCount;
    
    @JsonProperty("generation_duration")
    private String generationDuration;
    
    // Constructors
    public GenerationStatsDTO() {}
    
    public GenerationStatsDTO(Integer generatedCount, String generationDuration) {
        this.generatedCount = generatedCount;
        this.generationDuration = generationDuration;
    }
    
    // Getters and Setters
    public Integer getGeneratedCount() {
        return generatedCount;
    }
    
    public void setGeneratedCount(Integer generatedCount) {
        this.generatedCount = generatedCount;
    }
    
    public String getGenerationDuration() {
        return generationDuration;
    }
    
    public void setGenerationDuration(String generationDuration) {
        this.generationDuration = generationDuration;
    }
}