package com.tenxcards.flashcards.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "users", schema = "auth")
@Immutable
public class User {
    
    @Id
    private UUID id;
    
    @Column(name = "email")
    private String email;
    
    @Column(name = "encrypted_password")
    private String encryptedPassword;
    
    @Column(name = "raw_user_meta_data")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> rawUserMetaData;
    
    @Column(name = "email_confirmed_at")
    private LocalDateTime emailConfirmedAt;
    
    @Column(name = "last_sign_in_at")
    private LocalDateTime lastSignInAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Generation> generations = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Flashcard> flashcards = new ArrayList<>();
    
    // Constructors
    public User() {}
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getEncryptedPassword() {
        return encryptedPassword;
    }
    
    public void setEncryptedPassword(String encryptedPassword) {
        this.encryptedPassword = encryptedPassword;
    }
    
    public Map<String, Object> getRawUserMetaData() {
        return rawUserMetaData;
    }
    
    public void setRawUserMetaData(Map<String, Object> rawUserMetaData) {
        this.rawUserMetaData = rawUserMetaData;
    }
    
    public LocalDateTime getEmailConfirmedAt() {
        return emailConfirmedAt;
    }
    
    public void setEmailConfirmedAt(LocalDateTime emailConfirmedAt) {
        this.emailConfirmedAt = emailConfirmedAt;
    }
    
    public LocalDateTime getLastSignInAt() {
        return lastSignInAt;
    }
    
    public void setLastSignInAt(LocalDateTime lastSignInAt) {
        this.lastSignInAt = lastSignInAt;
    }
    
    // Convenience method to extract name from metadata
    @Transient
    public String getName() {
        return rawUserMetaData != null ? 
            (String) rawUserMetaData.get("name") : null;
    }
    
    // Convenience method to check if email is confirmed
    @Transient
    public boolean isEmailConfirmed() {
        return emailConfirmedAt != null;
    }
    
    // Convenience method for password access (for UserPrincipal compatibility)
    @Transient
    public String getPassword() {
        return encryptedPassword;
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
    
    public List<Generation> getGenerations() {
        return generations;
    }
    
    public void setGenerations(List<Generation> generations) {
        this.generations = generations;
    }
    
    public List<Flashcard> getFlashcards() {
        return flashcards;
    }
    
    public void setFlashcards(List<Flashcard> flashcards) {
        this.flashcards = flashcards;
    }
}