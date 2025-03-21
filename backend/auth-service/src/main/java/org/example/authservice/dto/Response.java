package org.example.authservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.authservice.dto.response.TokenResponse;
import org.example.authservice.dto.response.UserResponse;
import org.example.authservice.util.UserRole;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class Response {
    // generic
    private int status;
    private String message;

    UserResponse userResponse;
    TokenResponse tokenResponse;

    private final LocalDateTime timestamp = LocalDateTime.now();

}
