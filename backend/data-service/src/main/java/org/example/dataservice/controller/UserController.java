package org.example.dataservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.dataservice.dto.ApiResponse;
import org.example.dataservice.dto.request.RegisterUserRequest;
import org.example.dataservice.dto.request.UserUpdateRequest;
import org.example.dataservice.dto.response.UserResponse;
import org.example.dataservice.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/data/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/registration")
    public ApiResponse<UserResponse> registerUser(@RequestBody RegisterUserRequest registerUserRequest) {
        return ApiResponse.<UserResponse>builder().data(userService.registerUser(registerUserRequest)).build();
    }

    @GetMapping("/me")
    public ApiResponse<UserResponse> getMe(@RequestHeader("X-Credential-Id") String credentialId) {
        return ApiResponse.<UserResponse>builder().data(userService.getUser(credentialId)).build();
    }

    @PostMapping("/me")
    public ApiResponse<UserResponse> updateMe(@RequestHeader("X-Credential-Id") String credentialId, @RequestBody UserUpdateRequest userUpdateRequest) {
        return ApiResponse.<UserResponse>builder().data(userService.updateUser(credentialId, userUpdateRequest)).build();
    }

    @GetMapping("/{credentialId}")
    public ApiResponse<UserResponse> getUser(@PathVariable String credentialId) {
        return ApiResponse.<UserResponse>builder().data(userService.getUser(credentialId)).build();
    }
}
