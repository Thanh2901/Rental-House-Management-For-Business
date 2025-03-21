package org.example.authservice.service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.authservice.dto.request.LoginRequest;
import org.example.authservice.dto.request.RegistrationRequest;
import org.example.authservice.dto.request.ResetPasswordDTO;
import org.example.authservice.dto.CredentialDTO;
import org.example.authservice.dto.response.TokenResponse;
import org.example.authservice.dto.response.UserResponse;
import org.example.authservice.entity.Credential;

public interface AuthenticationService {
    TokenResponse authenticate(LoginRequest loginRequest);

    TokenResponse refresh(HttpServletRequest request);

    String logout(HttpServletRequest request);

    String forgotPassword(String email);

    String resetPassword(String secretKey);

    String changePassword(ResetPasswordDTO secreteKey);

    UserResponse registration(RegistrationRequest registrationRequest);

    CredentialDTO createCredentialTest(CredentialDTO credentialDTO);

    UserResponse getUserInfo(HttpServletRequest request);

    CredentialDTO getCredentialById(String credentialId);
}
