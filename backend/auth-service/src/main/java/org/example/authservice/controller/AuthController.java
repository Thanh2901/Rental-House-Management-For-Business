package org.example.authservice.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang.StringUtils;
import org.example.authservice.dto.ApiResponse;
import org.example.authservice.dto.request.LoginRequest;
import org.example.authservice.dto.request.RegistrationRequest;
import org.example.authservice.dto.request.ResetPasswordDTO;
import org.example.authservice.dto.response.TokenResponse;
import org.example.authservice.dto.response.UserResponse;
import org.example.authservice.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;

    @PostMapping("/registration")
    public ApiResponse<UserResponse> registration(@RequestBody RegistrationRequest registrationRequest) {
        return ApiResponse.<UserResponse>builder().data(authenticationService.registration(registrationRequest)).build();
    }

    @PostMapping("/access-token")
    public ApiResponse<TokenResponse> login(@RequestBody LoginRequest loginRequest) {
        return ApiResponse.<TokenResponse>builder().data(authenticationService.authenticate(loginRequest)).build();
    }

    @PostMapping("/refresh-token")
    public ApiResponse<TokenResponse> refresh(HttpServletRequest request) {
        return ApiResponse.<TokenResponse>builder().data(authenticationService.refresh(request)).build();
    }

    @PostMapping("/remove-token")
    public ApiResponse<String> logout(HttpServletRequest request) {
        return ApiResponse.<String>builder().data(authenticationService.logout(request)).build();
    }

    @PostMapping("/forget-password")
    public ApiResponse<String> forgetPassword(@RequestBody String email) {
        return ApiResponse.<String>builder().data(authenticationService.resetPassword(email)).build();
    }

    @PostMapping("/reset-password")
    public ApiResponse<String> resetPassword(@RequestBody String secretKey) {
        return ApiResponse.<String>builder().data(authenticationService.resetPassword(secretKey)).build();
    }

    @PostMapping("/change-password")
    public ApiResponse<String> changePassword(@RequestBody ResetPasswordDTO request) {
        return ApiResponse.<String>builder().data(authenticationService.changePassword(request)).build();
    }

    @PostMapping("/user-info")
    public ApiResponse<UserResponse> getUserInfo(HttpServletRequest request) {
        return ApiResponse.<UserResponse>builder().data(authenticationService.getUserInfo(request)).build();
    }

//    @GetMapping("/{id}")
//    public ApiResponse<CredentialDTO> getUser(@PathVariable String id) {
//        return ApiResponse.<CredentialDTO>builder().data(authenticationService.getCredentialById(id)).build();
//    }
}
