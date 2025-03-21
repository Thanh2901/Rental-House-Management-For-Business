package org.example.authservice.mapper;

import org.example.authservice.dto.CredentialDTO;
import org.example.authservice.entity.Credential;
import org.springframework.stereotype.Component;

@Component
public class CredentialMapper {
    public CredentialDTO toCredentialResponse(Credential credential) {
        if (credential == null) {
            return null;
        }

        CredentialDTO credentialResponse = CredentialDTO.builder()
                .id(credential.getId())
                .email(credential.getEmail())
                .password(credential.getPassword())
                .role(credential.getRole())
                .build();

        return credentialResponse;
    }

    public Credential toCredential(CredentialDTO credentialDTO) {
        if (credentialDTO == null) {
            return null;
        }

        Credential credential = Credential.builder()
                .id(credentialDTO.getId())
                .email(credentialDTO.getEmail())
                .password(credentialDTO.getPassword())
                .role(credentialDTO.getRole())
                .build();

        return credential;
    }
}
