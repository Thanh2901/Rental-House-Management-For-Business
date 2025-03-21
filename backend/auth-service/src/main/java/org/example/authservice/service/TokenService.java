package org.example.authservice.service;

import org.example.authservice.entity.Token;

public interface TokenService {
    int saveToken(Token token);
    String deleteToken(Token token);
}
