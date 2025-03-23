package org.example.dataservice.service;

import org.example.dataservice.dto.BookingDTO;
import org.example.dataservice.dto.request.RegisterUserRequest;
import org.example.dataservice.dto.request.UserUpdateRequest;
import org.example.dataservice.dto.response.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse registerUser(RegisterUserRequest request);
    UserResponse updateUser(String credentialId, UserUpdateRequest request);
    UserResponse getUser(String credentialId);
    void deleteUser(Long id);
    UserResponse getUserById(Long id);
    List<BookingDTO> getBookingHistory(Long id);
}
