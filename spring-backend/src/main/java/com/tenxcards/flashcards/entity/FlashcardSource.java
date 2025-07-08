package com.tenxcards.flashcards.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum FlashcardSource {
    MANUAL("manual"),
    AI_FULL("ai-full"),
    AI_EDITED("ai-edited");
    
    private final String value;
    
    FlashcardSource(String value) {
        this.value = value;
    }
    
    @JsonValue
    public String getValue() {
        return value;
    }
    
    @JsonCreator
    public static FlashcardSource fromValue(String value) {
        for (FlashcardSource source : FlashcardSource.values()) {
            if (source.value.equals(value)) {
                return source;
            }
        }
        throw new IllegalArgumentException(
            "Invalid flashcard source: " + value + ". Valid values: manual, ai-full, ai-edited"
        );
    }
}