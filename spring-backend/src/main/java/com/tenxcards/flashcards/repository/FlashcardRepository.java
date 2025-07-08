package com.tenxcards.flashcards.repository;

import com.tenxcards.flashcards.entity.Flashcard;
import com.tenxcards.flashcards.entity.Generation;
import com.tenxcards.flashcards.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {
    List<Flashcard> findByUserOrderByDisplayOrder(User user);
    List<Flashcard> findByGenerationOrderByDisplayOrder(Generation generation);
    Optional<Flashcard> findByIdAndUser(Long id, User user);
    void deleteByGeneration(Generation generation);
}