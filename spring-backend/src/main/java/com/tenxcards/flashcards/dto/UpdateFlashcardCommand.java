package com.tenxcards.flashcards.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UpdateFlashcardCommand {
    
    @NotBlank(message = "Front text is required")
    @Size(max = 1000, message = "Front text must not exceed 1000 characters")
    private String front;
    
    @NotBlank(message = "Back text is required")
    @Size(max = 1000, message = "Back text must not exceed 1000 characters")
    private String back;
    
    @NotBlank(message = "Source is required")
    @Pattern(regexp = "manual|ai-edited", message = "Source must be 'manual' or 'ai-edited'")
    private String source;
    
    // Constructors
    public UpdateFlashcardCommand() {}
    
    public UpdateFlashcardCommand(String front, String back, String source) {
        this.front = front;
        this.back = back;
        this.source = source;
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
}