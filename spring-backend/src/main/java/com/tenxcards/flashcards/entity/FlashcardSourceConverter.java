package com.tenxcards.flashcards.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class FlashcardSourceConverter implements AttributeConverter<FlashcardSource, String> {
    @Override
    public String convertToDatabaseColumn(FlashcardSource attribute) {
        return attribute != null ? attribute.getValue() : null;
    }

    @Override
    public FlashcardSource convertToEntityAttribute(String dbData) {
        return dbData != null ? FlashcardSource.fromValue(dbData) : null;
    }
} 