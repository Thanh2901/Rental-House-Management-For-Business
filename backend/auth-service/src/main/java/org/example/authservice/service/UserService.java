package org.example.authservice.service;

import org.example.authservice.entity.Credential;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService {
    UserDetailsService userDetailsService();
    String saveUser(Credential credential);
    Credential getCredentialByEmail(String email);
}
