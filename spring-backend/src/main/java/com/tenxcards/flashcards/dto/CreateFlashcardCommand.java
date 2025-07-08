package com.tenxcards.flashcards.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CreateFlashcardCommand {
    
    @NotBlank(message = "Front text is required")
    @Size(max = 1000, message = "Front text must not exceed 1000 characters")
    private String front;
    
    @NotBlank(message = "Back text is required")
    @Size(max = 1000, message = "Back text must not exceed 1000 characters")
    private String back;
    
    @NotBlank(message = "Source is required")
    @Pattern(regexp = "manual|ai-full|ai-edited", message = "Source must be 'manual', 'ai-full', or 'ai-edited'")
    private String source;
    
    @JsonProperty("generation_id")
    private Long generationId;
    
    @NotNull(message = "Display order is required")
    @JsonProperty("display_order")
    private Integer displayOrder;
    
    // Constructors
    public CreateFlashcardCommand() {}
    
    public CreateFlashcardCommand(String front, String back, String source, Long generationId, Integer displayOrder) {
        this.front = front;
        this.back = back;
        this.source = source;
        this.generationId = generationId;
        this.displayOrder = displayOrder;
    }
    
    // Getters and Setters
    public String getFront() {
        return front;
    }
    
    public void setFront(String front) {
        this.front = front;
    }
    
    public String getBack() {
        return back;
    }
    
    public void setBack(String back) {
        this.back = back;
    }
    
    public String getSource() {
        return source;
    }
    
    public void setSource(String source) {
        this.source = source;
    }
    
    public Long getGenerationId() {
        return generationId;
    }
    
    public void setGenerationId(Long generationId) {
        this.generationId = generationId;
    }
    
    public Integer getDisplayOrder() {
        return displayOrder;
    }
    
    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}