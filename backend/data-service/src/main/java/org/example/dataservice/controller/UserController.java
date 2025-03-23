package org.example.dataservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.dataservice.dto.ApiResponse;
import org.example.dataservice.dto.BookingDTO;
import org.example.dataservice.dto.request.RegisterUserRequest;
import org.example.dataservice.dto.request.UserUpdateRequest;
import org.example.dataservice.dto.response.UserResponse;
import org.example.dataservice.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/data/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/registration")
    public ApiResponse<UserResponse> registerUser(@RequestBody RegisterUserRequest registerUserRequest) {
        return ApiResponse.<UserResponse>builder().data(userService.registerUser(registerUserRequest)).build();
    }

    @PostMapping("/update")
    public ApiResponse<UserResponse> updateMe(@RequestHeader("X-Credential-Id") String credentialId, @RequestBody UserUpdateRequest userUpdateRequest) {
        return ApiResponse.<UserResponse>builder().data(userService.updateUser(credentialId, userUpdateRequest)).build();
    }

    @GetMapping("get/{id}")
    public ApiResponse<UserResponse> getUserById(@PathVariable("id") Long id) {
        return ApiResponse.<UserResponse>builder().data(userService.getUserById(id)).build();
    }

    @GetMapping("/{credentialId}")
    public ApiResponse<UserResponse> getUser(@PathVariable String credentialId) {
        return ApiResponse.<UserResponse>builder().data(userService.getUser(credentialId)).build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ApiResponse.<String>builder().data("Deleted!").build();
    }

    @GetMapping("/history/booking/{id}")
    public ApiResponse<List<BookingDTO>> getBookingHistory(@PathVariable Long id) {
        return ApiResponse.<List<BookingDTO>>builder().data(userService.getBookingHistory(id)).build();
    }
}
