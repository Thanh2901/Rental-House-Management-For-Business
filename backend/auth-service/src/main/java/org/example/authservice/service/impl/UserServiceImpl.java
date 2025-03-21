package org.example.authservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.authservice.entity.Credential;
import org.example.authservice.repository.CredentialRepository;
import org.example.authservice.service.UserService;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final CredentialRepository credentialRepository;

    @Override
    public UserDetailsService userDetailsService() {
        return username -> credentialRepository.findCredentialByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    public String saveUser(Credential credential) {
        credentialRepository.save(credential);
        return credential.getId();
    }

    @Override
    public Credential getCredentialByEmail(String email) {
        return credentialRepository.findCredentialByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
