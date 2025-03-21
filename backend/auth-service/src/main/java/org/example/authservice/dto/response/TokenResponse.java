package org.example.authservice.dto.response;

import lombok.Builder;
import lombok.Data;
import org.example.authservice.entity.Credential;

@Data
@Builder
public class TokenResponse {
    private String accessToken;
    private String refreshToken;
}
