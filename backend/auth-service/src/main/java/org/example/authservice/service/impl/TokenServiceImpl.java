package org.example.authservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.authservice.entity.Token;
import org.example.authservice.repository.TokenRepository;
import org.example.authservice.service.TokenService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {

    private final TokenRepository tokenRepository;

    @Override
    public int saveToken(Token token) {
        Optional<Token> optional = tokenRepository.findByEmail(token.getEmail());
        if (optional.isEmpty()) {
            tokenRepository.save(token);
            return token.getId();
        } else {
            Token currentToken = optional.get();
            currentToken.setAccessToken(token.getAccessToken());
            currentToken.setRefreshToken(token.getRefreshToken());
            tokenRepository.save(currentToken);
            return currentToken.getId();
        }
    }

    @Override
    public String deleteToken(Token token) {
        tokenRepository.delete(token);
        return "Deleted!";
    }

    public Token getByUsername(String email) {
        return tokenRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Token not exist"));
    }
}
