package com.tenxcards.flashcards.entity;

public enum FlashcardSource {
    MANUAL("manual"),
    AI_FULL("ai-full"),
    AI_EDITED("ai-edited");
    
    private final String value;
    
    FlashcardSource(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
    
    public static FlashcardSource fromValue(String value) {
        for (FlashcardSource source : FlashcardSource.values()) {
            if (source.value.equals(value)) {
                return source;
            }
        }
        throw new IllegalArgumentException("Invalid flashcard source: " + value);
    }
}