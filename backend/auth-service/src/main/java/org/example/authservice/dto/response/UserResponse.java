package org.example.authservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Long id;
    private String credentialId;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String identityCardNumber;
    private String country;
}
