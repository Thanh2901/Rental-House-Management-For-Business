package org.example.authservice.dto;

import lombok.*;
import org.example.authservice.util.UserRole;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CredentialDTO {
    private String id;
    private String email;
    private String password;
    private UserRole role;
}
