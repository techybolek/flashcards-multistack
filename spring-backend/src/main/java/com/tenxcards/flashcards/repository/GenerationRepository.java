package com.tenxcards.flashcards.repository;

import com.tenxcards.flashcards.entity.Generation;
import com.tenxcards.flashcards.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GenerationRepository extends JpaRepository<Generation, Long> {
    List<Generation> findByUserOrderByCreatedAtDesc(User user);
    Optional<Generation> findByIdAndUser(Long id, User user);
}