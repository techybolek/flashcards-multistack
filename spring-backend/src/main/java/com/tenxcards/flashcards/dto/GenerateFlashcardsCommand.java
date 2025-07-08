package com.tenxcards.flashcards.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class GenerateFlashcardsCommand {
    
    @NotBlank(message = "Text is required")
    @Size(min = 1000, max = 10000, message = "Text must be between 1000 and 10000 characters")
    private String text;
    
    // Constructors
    public GenerateFlashcardsCommand() {}
    
    public GenerateFlashcardsCommand(String text) {
        this.text = text;
    }
    
    // Getters and Setters
    public String getText() {
        return text;
    }
    
    public void setText(String text) {
        this.text = text;
    }
}