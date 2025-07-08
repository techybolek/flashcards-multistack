package com.tenxcards.flashcards.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class FlashcardDTO {
    
    private Long id;
    private String front;
    private String back;
    private String source;
    
    @JsonProperty("created_at")
    private String createdAt;
    
    @JsonProperty("updated_at")
    private String updatedAt;
    
    @JsonProperty("generation_id")
    private Long generationId;
    
    @JsonProperty("display_order")
    private Integer displayOrder;
    
    // Constructors
    public FlashcardDTO() {}
    
    public FlashcardDTO(Long id, String front, String back, String source, String createdAt, String updatedAt, Long generationId, Integer displayOrder) {
        this.id = id;
        this.front = front;
        this.back = back;
        this.source = source;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.generationId = generationId;
        this.displayOrder = displayOrder;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public String getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
    
    public String getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
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