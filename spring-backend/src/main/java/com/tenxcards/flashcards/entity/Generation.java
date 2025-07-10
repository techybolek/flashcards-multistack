package com.tenxcards.flashcards.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "generations")
public class Generation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "generation_name", nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "generated_count", nullable = false)
    private Integer generatedCount = 0;

    @Column(name = "accepted_unedited_count", nullable = false)
    private Integer acceptedUneditedCount = 0;

    @Column(name = "accepted_edited_count", nullable = false)
    private Integer acceptedEditedCount = 0;

    @Column(name = "source_text_length", nullable = false)
    private Integer sourceTextLength;

    @Column(name = "generation_duration", nullable = false)
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.INTERVAL_SECOND)
    private Duration generationDuration;

    @Column(name = "model", nullable = false)
    private String model;

    @Column(name = "source_text_hash", nullable = false)
    private String sourceTextHash;

    @OneToMany(mappedBy = "generation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Flashcard> flashcards = new ArrayList<>();

    // Constructors
    public Generation() {}

    public Generation(String name, User user) {
        this.name = name;
        this.user = user;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Integer getGeneratedCount() {
        return generatedCount;
    }

    public void setGeneratedCount(Integer generatedCount) {
        this.generatedCount = generatedCount;
    }

    public Integer getAcceptedUneditedCount() {
        return acceptedUneditedCount;
    }

    public void setAcceptedUneditedCount(Integer acceptedUneditedCount) {
        this.acceptedUneditedCount = acceptedUneditedCount;
    }

    public Integer getAcceptedEditedCount() {
        return acceptedEditedCount;
    }

    public void setAcceptedEditedCount(Integer acceptedEditedCount) {
        this.acceptedEditedCount = acceptedEditedCount;
    }

    public Integer getSourceTextLength() {
        return sourceTextLength;
    }

    public void setSourceTextLength(Integer sourceTextLength) {
        this.sourceTextLength = sourceTextLength;
    }

    public Duration getGenerationDuration() {
        return generationDuration;
    }

    public void setGenerationDuration(Duration generationDuration) {
        this.generationDuration = generationDuration;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getSourceTextHash() {
        return sourceTextHash;
    }

    public void setSourceTextHash(String sourceTextHash) {
        this.sourceTextHash = sourceTextHash;
    }

    public List<Flashcard> getFlashcards() {
        return flashcards;
    }

    public void setFlashcards(List<Flashcard> flashcards) {
        this.flashcards = flashcards;
    }
}
