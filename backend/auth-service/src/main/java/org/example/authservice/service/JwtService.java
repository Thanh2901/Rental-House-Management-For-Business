package org.example.authservice.service;

import org.example.authservice.util.TokenType;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;

public interface JwtService {
    String generateAccessToken(UserDetails userDetails);
    String generateRefreshToken(UserDetails userDetails);
    String generateResetToken(UserDetails userDetails);
    String  extractEmail(String token, TokenType tokenType);
    boolean isValidToken(String token, UserDetails userDetails, TokenType tokenType);
}
