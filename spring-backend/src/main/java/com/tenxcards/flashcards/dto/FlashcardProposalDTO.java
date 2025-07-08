package com.tenxcards.flashcards.dto;

public class FlashcardProposalDTO {
    
    private String front;
    private String back;
    private String source = "ai-full";
    
    // Constructors
    public FlashcardProposalDTO() {}
    
    public FlashcardProposalDTO(String front, String back) {
        this.front = front;
        this.back = back;
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