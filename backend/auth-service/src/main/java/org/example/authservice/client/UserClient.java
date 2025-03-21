package org.example.authservice.client;

import org.example.authservice.dto.ApiResponse;
import org.example.authservice.dto.request.RegisterUserRequest;
import org.example.authservice.dto.response.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "data-service", url = "http://localhost:9007")
public interface UserClient {
    @PostMapping("/api/users/registration")
    ApiResponse<UserResponse> registerUser(@RequestBody RegisterUserRequest registerUserRequest);

    @GetMapping("/api/users/{credentialId}")
    ApiResponse<UserResponse> getUser(@PathVariable("credentialId") String credentialId);
}
