package org.example.authservice.service.impl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.util.Arrays;
import org.example.authservice.constant.JwtConstant;
import org.example.authservice.service.JwtService;
import org.example.authservice.util.TokenType;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.example.authservice.util.TokenType.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {

    private final String accessKey = JwtConstant.ACCESS_KEY;
    private final String refreshKey = JwtConstant.REFRESH_KEY;
    private final String resetKey = JwtConstant.RESET_KEY;
    private final long expirationHour = JwtConstant.JWT_EXPIRATION_HOUR;
    private final long expirationDay = JwtConstant.JWT_EXPIRATION_DAY;

    @Override
    public String generateAccessToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority) // get "ROLE_ADMIN" or "ROLE_USER"
                .collect(Collectors.toList()));
        return generateAccessToken(claims, userDetails);
    }

    @Override
    public String extractEmail(String token, TokenType tokenType) {
        return extractClaims(token, Claims::getSubject, tokenType);
    }

    @Override
    public boolean isValidToken(String token, UserDetails userDetails, TokenType tokenType) {
        final String email = extractEmail(token, tokenType);
        return (email.equals(userDetails.getUsername()) && !isTokenExpired(token, tokenType));
    }

    private boolean isTokenExpired(String token, TokenType tokenType) {
        return extractExpiration(token, tokenType).before(new Date());
    }

    private Date extractExpiration(String token, TokenType tokenType) {
        return extractClaims(token, Claims::getExpiration, tokenType);
    }

    @Override
    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority) // get "ROLE_ADMIN" or "ROLE_USER"
                .collect(Collectors.toList()));
        return generateRefreshToken(claims, userDetails);
    }

    @Override
    public String generateResetToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority) // get "ROLE_ADMIN" or "ROLE_USER"
                .collect(Collectors.toList()));
        String resetToken = generateResetToken(claims, userDetails);
        log.info("Generated reset token: {}", resetToken);
        return resetToken;
    }

    private String generateAccessToken(Map<String, Object> claims, UserDetails userDetails) {
        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * expirationHour)) // 1 day
                .signWith(getSecretKey(ACCESS_TOKEN))
                .compact();
    }

    private String generateRefreshToken(Map<String, Object> claims, UserDetails userDetails) {
        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * expirationHour * expirationDay)) // 1 month
                .signWith(getSecretKey(REFRESH_TOKEN))
                .compact();
    }

    private String generateResetToken(Map<String, Object> claims, UserDetails userDetails) {
        String resetToken = Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 2)) // 2 minutes
                .signWith(getSecretKey(RESET_TOKEN))
                .compact();
        log.info("Generated reset token: {}", resetToken);
        String[] tokenParts = resetToken.split("\\.");
        log.info("Token parts count: {}", tokenParts.length);
        if (tokenParts.length != 3) {
            throw new RuntimeException("Generated reset token is malformed: " + resetToken);
        }
        return resetToken;
    }

    private SecretKey getSecretKey(TokenType tokenType) {
        String keyString;
        switch (tokenType) {
            case ACCESS_TOKEN -> keyString = accessKey;
            case REFRESH_TOKEN -> keyString = refreshKey;
            case RESET_TOKEN -> keyString = resetKey;
            default -> throw new RuntimeException("Token type is invalid");
        }

        byte[] keyBytes;
        if (tokenType == RESET_TOKEN) {
            try {
                keyBytes = Base64.getDecoder().decode(keyString);
                log.info("Decoded resetKey: {}, length: {}", keyString, keyBytes.length);
            } catch (IllegalArgumentException e) {
                log.error("Failed to decode resetKey: {}", keyString, e);
                throw new RuntimeException("Invalid resetKey format");
            }
        } else {
            keyBytes = keyString.getBytes(StandardCharsets.UTF_8);
        }

        if (keyBytes.length < 32) {
            log.warn("Key length is less than 32 bytes, padding to 32 bytes");
            keyBytes = Arrays.copyOf(keyBytes, 32);
        }

        return Keys.hmacShaKeyFor(keyBytes);
    }

    private <T> T extractClaims(String token, Function<Claims, T> claimsResolver, TokenType tokenType) {
        final Claims claims = extractAllClaims(token, tokenType);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token, TokenType tokenType) {
        return Jwts.parser()
                .verifyWith(getSecretKey(tokenType))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
