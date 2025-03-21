package org.example.authservice.repository;

import org.example.authservice.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Integer> {
    @Query("select r from Token r where r.email= :email")
    Optional<Token> findByEmail(String email);
}
