package org.example.dataservice.service;

import org.example.dataservice.dto.request.RegisterUserRequest;
import org.example.dataservice.dto.request.UserUpdateRequest;
import org.example.dataservice.dto.response.UserResponse;

public interface UserService {
    UserResponse registerUser(RegisterUserRequest request);
    UserResponse updateUser(String credentialId, UserUpdateRequest request);
    UserResponse getUser(String credentialId);
}
