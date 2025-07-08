package com.tenxcards.flashcards.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "flashcards")
public class Flashcard {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 1000)
    private String front;
    
    @Column(nullable = false, length = 1000)
    private String back;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FlashcardSource source;
    
    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "generation_id")
    private Generation generation;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Constructors
    public Flashcard() {}
    
    public Flashcard(String front, String back, FlashcardSource source, Integer displayOrder, User user) {
        this.front = front;
        this.back = back;
        this.source = source;
        this.displayOrder = displayOrder;
        this.user = user;
    }
    
    public Flashcard(String front, String back, FlashcardSource source, Integer displayOrder, User user, Generation generation) {
        this.front = front;
        this.back = back;
        this.source = source;
        this.displayOrder = displayOrder;
        this.user = user;
        this.generation = generation;
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
    
    public FlashcardSource getSource() {
        return source;
    }
    
    public void setSource(FlashcardSource source) {
        this.source = source;
    }
    
    public Integer getDisplayOrder() {
        return displayOrder;
    }
    
    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Generation getGeneration() {
        return generation;
    }
    
    public void setGeneration(Generation generation) {
        this.generation = generation;
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
}